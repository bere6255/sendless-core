import Pin from '../../models/Pin';
import Token from "../../models/Token";
import bcrypt from "bcryptjs";
import User from '../../models/User';
import Bans from '../../models/Bans';
import moment from 'moment';
import AppError from '../../utils/AppError';

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
const MAX_ATTEMPTS = 5;
const logPrefix = "PIN:UPDATEPIN:SERVICE";

type SetPin = {
  newPin: string,
  user: any,
  token: string
};

export default async ({ newPin, user, token }: SetPin) => {
  console.log(`${logPrefix} init user ${user.email}`);

  const pin = await Pin.query().findOne({ user_id: user.id });

  if (!pin) {
    throw new AppError("Please set a transaction pin", 400, logPrefix, {});
  }

  const getToken = await Token.query().findOne({ token });
  if (!getToken) {
    throw new AppError("Token not found, please try again", 400, logPrefix, {});
    
  }

  const timeDifference = moment().diff(moment(getToken.created_at), 'minutes');
  if (timeDifference >= 10) {
    throw new AppError("Token expired, Please try generating a new token", 400, logPrefix, {});
  }

  if (getToken.identifier !== user.phone) {
    let pinAttempt = parseInt(pin.pin_attempts || '0');

    if (pinAttempt >= MAX_ATTEMPTS) {
      console.log(`${logPrefix} ban user ${user.email} for exceeding reset pin attempts`);
      await banUser(user.id, user.email);
      throw new AppError("Too many incorrect attempts. Your account has been locked.", 403, logPrefix, {});
    }

    await Pin.query()
      .patchAndFetchById(pin.id, { pin_attempts: `${pinAttempt + 1}` });

    throw new AppError(`Invalid token. You have ${MAX_ATTEMPTS - pinAttempt - 1} attempts remaining`, 400, logPrefix, {});
  }

  const isSameAsOldPin = await bcrypt.compare(newPin, pin.pin);
  if (isSameAsOldPin) {
    let pinAttempt = parseInt(pin.pin_attempts || '0');

    if (pinAttempt >= MAX_ATTEMPTS) {
      console.log(`${logPrefix} ban user ${user.email} for exceeding reset pin attempts`);
      await banUser(user.id, user.email);
      throw new AppError("Too many incorrect attempts. Your account has been locked.", 403, logPrefix, {});
    }

    await Pin.query()
      .patchAndFetchById(pin.id, { pin_attempts: `${pinAttempt + 1}` });

    throw new AppError(`You cannot reuse your old PIN. ${MAX_ATTEMPTS - pinAttempt - 1} attempts remaining`, 400, logPrefix, {});
  }

  const hashPin = await bcrypt.hash(newPin, saltRounds);

  const updateResult = await Pin.query()
    .patchAndFetchById(pin.id, {
      pin: hashPin,
      pin_attempts: '0',
      updated_at: new Date(),
    });

  if (!updateResult) {
    throw new AppError("PIN not updated, please try again", 400, logPrefix, {});
  }

  // Optionally delete the token after successful use
  await Token.query().deleteById(getToken.id);

  return {
    status: "success",
    statusCode: 201,
    data: {},
    message: "PIN updated"
  };
};

// Helper function to ban user
async function banUser(userId: string, userEmail: string) {
  await User.query().patch({ banned_at: new Date() }).where("id", userId);
  await Bans.query().insert({
    user_id: userId,
    ban_by: "system:pin:otp",
    comment: "Ban for exceeding reset pin attempts",
    created_at: new Date(),
    updated_at: new Date()
  });
}
