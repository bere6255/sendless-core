import Pin from '../../models/Pin';
import bcrypt from "bcryptjs"
import AppError from '../../utils/AppError';
import redisConnection from '../../redis/redisConnection';

const logPrefix = "[PIN:SETPIN:SERVICE]";
const saltRounds = process.env.SALT_ROUNDS || '10';

type setPing = {
    pin: string,
    user: any
}

export default async ({ pin, user }: setPing) => {

    console.log(`${logPrefix} init ===> user_id: ${user.email}`);

    const conPin = `${pin}`
    const checkPin = await Pin.query().findOne({ user_id: user.id });
    if (checkPin) {
        throw new AppError("You have already set your pin", 400, logPrefix, {});
    }
    const newPin = await bcrypt.hash(
        conPin.toString(),
        parseInt(saltRounds)
    );

    await Pin.query().insert({
        user_id: user.id,
        pin: newPin,
        pin_attempts: 0,
        reset_attempts: 0,
        created_at: new Date()
    });

    await redisConnection({ type: "delete", key: `users:${user.id}`, value: null, time: null });

    return { status: "success", statusCode: 200, data: {}, message: "Pin set successful" }

}