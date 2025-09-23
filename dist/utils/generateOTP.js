"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
//# sourceMappingURL=generateOTP.js.map