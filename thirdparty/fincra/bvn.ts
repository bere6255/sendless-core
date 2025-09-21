import * as env from "dotenv";
env.config();
import fincra from "../../configs/fincra";
const FINCRA_BUSINES_ID = process.env.FINCRA_BUSINES_ID;
const logPrefix = "[THIRDPARTY:FINCRA:BVN]";
type collections = {
    bvn: string
}
export default async ({ bvn }: collections) => {
    try {
        console.log(`${logPrefix} init ===> user:bvn ${bvn}`, JSON.stringify({ bvn }));
  
        const payload = {
            bvn: bvn,
            business: FINCRA_BUSINES_ID
        }

        const fincraRes = await fincra.post("/core/bvn-verification", payload);
        
        return { status: true, data: fincraRes?.data?.data, message: fincraRes.data.message }
    } catch (error) {
        let message = "Failed to queiry bvn, please try again in a few minutes"
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