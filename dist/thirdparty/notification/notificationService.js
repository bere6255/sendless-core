"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    pushNotification: (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!message) {
                return {
                    success: false,
                    status: 200,
                    message: "no data and title 👀"
                };
            }
            if (!message.token || !message.notification.title) {
                return {
                    success: false,
                    status: 200,
                    message: "no data and title 👀"
                };
            }
            if (typeof message.token === "string") {
                yield config_1.default.messaging().send(message);
            }
            else if (Array.isArray(message.token)) {
                if (message.token.length > 0) {
                    message.tokens = message.token;
                    delete message.token;
                    yield config_1.default.messaging().sendMulticast(message);
                }
            }
            return {
                success: true,
                status: 200,
                message: "Notification sent successfully"
            };
        }
        catch (error) {
            console.log("===================== push error ====> ", error);
            if (error) {
                if (error.errorInfo) {
                    if (error.errorInfo.code === 'messaging/invalid-argument') {
                        console.log("===================== Invalid Push Token - messaging/invalid-argument ====> ");
                        return {
                            success: false,
                            status: 200,
                            message: "Invalid Token"
                        };
                    }
                    if (error.errorInfo.code === 'messaging/registration-token-not-registered') {
                        console.log("===================== Invalid Push Token - messaging/registration-token-not-registered ====> ");
                        return {
                            success: false,
                            status: 200,
                            message: "Invalid Token"
                        };
                    }
                }
            }
            return {
                success: false,
                status: 500,
                message: "something went wrong"
            };
        }
    })
};
//# sourceMappingURL=notificationService.js.map