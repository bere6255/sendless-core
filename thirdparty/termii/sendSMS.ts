import termii from "../../configs/termii";
const TERMII_API_TOKEN = process.env.TERMII_API_TOKEN
const logPrefix ="[THIRDPARTY:TERMII:SMS]";
type sms = {
    body: string
    to: string
}
export default async ({body, to}: sms)=>{
    try {
        console.log(`${logPrefix} init ===> ${to}`);
        
        const smsRes = await termii.post('/api/sms/send', {
            "to": `${to}`,
            "from": "N-Alert",
            "sms": `${body}`,
            "type": "plain",
            "channel": "dnd",
            "api_key": `${TERMII_API_TOKEN}`,   
        });
        console.log(`${logPrefix} res ===>  ${to} `, JSON.stringify(smsRes.data));
        return true
    } catch (error: any) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return false
    }

}
