import verification from "./messagess/verification";
import sendSMS from "../../../thirdparty/termii/sendSMS";
type phoneNotification = {
    phone: string
    type: string
    meta: any
}
export default async ({ phone, type, meta }: phoneNotification) => {
    try {
        let message = verification({type, token: meta?.token });

        if (message) {
            await sendSMS({ body: message, to: phone });
        }

        return true

    } catch (error: any) {
        console.log("Phone notification Error ===> ", error.message, error.stack);
        return false
    }
}