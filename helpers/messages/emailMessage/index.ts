import * as env from "dotenv";
env.config();
import nodeMail from "../../../configs/nodeMail";
import token from "./messagess/token";
import login from "./messagess/login";
import changePassword from "./messagess/changePassword";
type email = {
    email: string
    type: string
    meta: any
}
export default async ({ email, type, meta }: email) => {
    try {
        const regex = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");
        if (regex.test(email)) {
            let message
            let subject
            switch (type) {
                case "register":
                    message = token({ token: meta?.token });
                    subject = "Tencoin : Verification Token"
                    break;
                case "login":
                    message = login({ name: meta?.name, userAgent: meta.userAgent });
                    subject = `Tencoin : Security alert login`
                    break;
                case "chagePassword":
                    message = changePassword({ name: meta?.name });
                    subject = `Tencoin : Security alert password change}`
                    break;
                default:
                    break;
            }
            if (email && subject && message) {
                await nodeMail({ to: email, subject, message });

            }
        }
        return true

    } catch (error: any) {
        console.log("Email notification Error ===> ", error.message, error.stack);
        return false
    }
}