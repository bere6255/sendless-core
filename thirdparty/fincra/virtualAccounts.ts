import * as env from "dotenv";
env.config();
import fincra from "../../configs/fincra";
const logPrefix = "[THIRDPARTY:FINCRA:VIRTUALACCOUNT]";
type collections = {
    bvn: string;
    firstName: string;
    lastName: string;
    email: string
}
export default async ({ firstName, lastName, email, bvn }: collections) => {
    try {
        console.log(`${logPrefix} init ===> user:bvn ${bvn}`, JSON.stringify({ bvn }));

        const payload = {
            currency: "NGN",
            accountType: "individual",
            channel: "wema",
            KYCInformation: {
                firstName,
                lastName,
                email,
                bvn
            }
        }

        const fincraRes = await fincra.post("/profile/virtual-accounts/requests", payload);

        return { status: true, data: fincraRes?.data?.data, message: fincraRes.data.message }
    } catch (error) {
        let message = "Failed to generate account, please try again in a few minutes"
        if (error.response) {
            if (error.response.data) {
                if (error.response.data.message) {
                    message = error.response.data.message;
                }
            }
        }

        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return { status: false, data: {}, message }
    }
}