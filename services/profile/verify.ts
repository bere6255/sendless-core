import Token from "../../models/Token";
import User from "../../models/User";
import redisConnection from "../../redis/redisConnection";

type bvn = {
    user: any;
    token: string;
}
const logPrefix = "[SERVICE:PROFILE:VERIFY]";

export default async ({ user, token }: bvn) => {
    try {
        console.log(`${logPrefix} init ===> `, JSON.stringify({ phone: user.phone }));
        let type="Email"
        const getToken = await Token.query().findOne({ token });
        if (!getToken) {
            return { status: false, statusCode: 400, data: {}, message: "Token not found , Please try again" }
        }
        if (getToken.type === "email-verification") {
            if (!user.email) {
                return { status: false, statusCode: 400, data: {}, message: "please add an email address to continue" }

            }
            if (user.email !== getToken.identifier) {
                 return { status: false, statusCode: 400, data: {}, message: "Token mismatch, Please try again" }
            }

              await User.query().findByIds(user.id).update({
                    email_verified_at: new Date,
                    updated_at: new Date
                });
                 await redisConnection({ type: "delete", key: `users:${user.id}`, value: null, time: null });
        }

        return { status: true, statusCode: 200, data: {}, message: `${type} verified successfully`}
    } catch (error: any) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return { status: false, statusCode: 400, data: {}, message: "please try again" }
    }
}