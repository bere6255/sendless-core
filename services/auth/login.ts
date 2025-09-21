import User from "../../models/User";
import Bans from "../../models/Bans";
import bcrypt from "bcryptjs";
import generateJWT from "../../helpers/generateJWT";
import getUser from "../profile/getUser";
import emailMessage from "../../helpers/messages/emailMessage";
import AppError from "../../utils/AppError";

const logPrefixDefault = "[SERVICE:AUTH:LOGIN]";
const MAX_LOGIN_ATTEMPTS = 5;

type LoginPayload = {
  emailPhone: string;
  password: string;
  type: string;
  userAgent: string;
  logPrefix?: string;
};

export default async ({
  emailPhone,
  password,
  type,
  userAgent,
  logPrefix = logPrefixDefault,
}: LoginPayload) => {
  const queryField = type === "phone" ? "phone" : "email";
  const user = await User.query()
    .findOne({ [queryField]: emailPhone })
    .whereNull("deleted_at")
    .withGraphFetched("wallet");

  if (!user) {
    throw new AppError("Wrong email and password combination", 400, logPrefix, {});
  }

  // Check for existing bans and ban status first
  if (user.login_attempts >= MAX_LOGIN_ATTEMPTS || user.banned_at) {
    throw new AppError("Ban for exceeding login attempts", 406, logPrefix, {});
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const newAttempts = (user.login_attempts || 0) + 1;
    await User.query().findById(user.id).patch({ login_attempts: newAttempts });

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      console.log(
        `${logPrefix} Banning user_id ${user.id} due to failed login attempts`
      );
      await User.query().findById(user.id).patch({ banned_at: new Date() });
      await Bans.query().insert({
        user_id: user.id,
        ban_by: "system:login",
        comment: "Ban for exceeding login attempts",
      });
      throw new AppError("Ban for exceeding login attempts", 406, logPrefix, {});
    }

    throw new AppError("Wrong email and password combination", 400, logPrefix, {});
  }

  // Login successful
  await User.query().findById(user.id).patch({ login_attempts: 0 });

  const token = generateJWT(user.id);
  const userProfile = await getUser({ userId: user.id });

  await emailMessage({
    email: user.email,
    type: "login",
    meta: { name: user.fullName, userAgent },
  });

  return {
    status: "success",
    statusCode: 200,
    data: { token, ...userProfile.data },
    message: "Login successful",
  };
};