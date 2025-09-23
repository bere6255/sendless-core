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
Object.defineProperty(exports, "__esModule", { value: true });
const notifications_1 = require("../../helpers/notifications");
const logPrefix = "NOTOFICATIONS:ALL:CONTROLLER";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const notification = yield (0, notifications_1.getNotification)({ userId: user.id });
        return res.status(200).send({
            status: "success",
            data: { notification: notification },
            message: " successful",
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=all.js.map