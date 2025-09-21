import firebase from "./config";


export default {
    pushNotification: async (message) => {
        try {

            if (!message) {
                return {
                    success: false,
                    status: 200,
                    message: "no data and title 👀"
                }
            }

            if (!message.token || !message.notification.title) {
                return {
                    success: false,
                    status: 200,
                    message: "no data and title 👀"
                }
            }

            if (typeof message.token === "string") {
                await firebase.messaging().send(message)
            }

            else if(Array.isArray(message.token)){
                if(message.token.length > 0){
                    message.tokens = message.token;
                    delete message.token;
                    await firebase.messaging().sendMulticast(message)
                }
            }



            return {
                success: true,
                status: 200,
                message: "Notification sent successfully"
            }

        } catch (error) {
            console.log("===================== push error ====> ", error)
            if (error) {
                if (error.errorInfo) {
                    if (error.errorInfo.code === 'messaging/invalid-argument') {
                        console.log("===================== Invalid Push Token - messaging/invalid-argument ====> ")
                        return {
                            success: false,
                            status: 200,
                            message: "Invalid Token"
                        }
                    }

                    if (error.errorInfo.code === 'messaging/registration-token-not-registered') {
                        console.log("===================== Invalid Push Token - messaging/registration-token-not-registered ====> ")
                        return {
                            success: false,
                            status: 200,
                            message: "Invalid Token"
                        }
                    }
                }
            }
            return {
                success: false,
                status: 500,
                message: "something went wrong"
            }
        }

    }
}