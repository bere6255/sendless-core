import User from "../../models/User";
import generateToken from "../../helpers/generateToken";
import phoneMessage from "../../helpers/messages/phoneMessage";
import emailMessage from "../../helpers/messages/emailMessage";
import { formartPhone } from "../../helpers/util";
import AppError from "../../utils/AppError";

type PhoneEmailOtp = {
  phoneEmail: string;
  type: "email" | "phone";
  metaData: any;
};

const logPrefix = "[AUTH:SENDEMAILPHONEOTP:SERVICE]";

export default async ({ phoneEmail, type, metaData }: PhoneEmailOtp) => {
  console.log(`${logPrefix} init ===> `, JSON.stringify({ phoneEmail, type, metaData }));

  if (!["email", "phone"].includes(type)) {
    throw Object.assign(new AppError("Invalid type provided", 400), { logPrefix });
  }

  if (type === "email") {
    const checkEmail = await User.query().findOne({ email: phoneEmail });
    if (checkEmail) {
      throw Object.assign(new AppError("Email already in use, please login", 400), { logPrefix });
    }

    const generateTokenRes = await generateToken({ identifier: phoneEmail, type: metaData.type });
    const meta = generateTokenRes?.data;

    await emailMessage({ email: phoneEmail, type: metaData.type, meta });

    return {
      statusCode: 200,
      status: "success",
      data: {},
      message: `A token has been sent to ****${phoneEmail.slice(4)}`,
    };
  }

  if (type === "phone") {
    if (!metaData?.country) {
      throw Object.assign(new AppError("Country is required", 400), { logPrefix });
    }

    const formatResult = formartPhone({ phone: phoneEmail, country: metaData.country });
    if (!formatResult.status) {
      throw Object.assign(new AppError("Country code not found", 400), { logPrefix });
    }

    const checkPhone = await User.query().findOne({ phone: formatResult.phone });
    if (checkPhone) {
      throw Object.assign(new AppError("Phone already in use", 400), { logPrefix });
    }

    const generateTokenRes = await generateToken({ identifier: formatResult.phone, type: metaData.type });
    const meta = generateTokenRes?.data;

    await phoneMessage({ phone: formatResult.phone, type: metaData.type, meta });

    return {
      statusCode: 200,
      status: "success",
      data: {},
      message: `A token has been sent to ****${phoneEmail.slice(-4)}`,
    };
  }

  // Should never reach here because of initial type check
  throw Object.assign(new AppError("Invalid request type", 400), { logPrefix });
};
