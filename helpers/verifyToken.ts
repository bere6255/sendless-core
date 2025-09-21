import Token from "../models/Token";
const logPrefix = "[VERIFY TOKEN]";
type verifyToken = {
    token: string
    type: string
    identifier: string
}
export default async ({ token, identifier, type }: verifyToken) => {
    try {
        console.log(`${logPrefix} init identifier: ${identifier}`);
        const getToken = await Token.query().findOne({ token, type }).orderBy('created_at', 'desc');

        if (!getToken) {
            // blackist the number and email after four try 
            return { status: false, data: {}, message: "Invalid token" };
        }
        if (getToken.identifier !== identifier) {
            // blackist the number and email after four try 
            await Token.query().where({ token, type }).delete();
            return { status: false, data: {}, message: "Invalid token" };
        }
        await Token.query().where({ identifier }).delete();
        return { status: true, data: {}, message: "successful" };
    } catch (error: any) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Error verifying token" }
    }
}