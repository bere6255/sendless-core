import Token from "../models/Token";
import generateOTP from "../utils/generateOTP";
const logPrefix = "[GEENERATE TOKEN]";
type verifyToken = {
    type: string
    identifier: string
}
export default async ({ identifier, type }: verifyToken) => {
    try {
        console.log(`${logPrefix} init`);
        const otp = generateOTP();

        await Token.query().insert({
            identifier,
            token: otp,
            type,
            validity: 5,
            created_at: new Date(),
            updated_at: new Date()
        });

        return { status: true, data: { token: otp }, message: "successful" };
    } catch (error: any) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);

        return { status: false, data: {token : null}, message: "Error generating token" }
    }
}