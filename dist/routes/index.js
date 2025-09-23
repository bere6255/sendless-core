"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const pin_1 = __importDefault(require("./pin"));
const webhooks_1 = __importDefault(require("./webhooks"));
const profile_1 = __importDefault(require("./profile"));
const notifications_1 = __importDefault(require("./notifications"));
const wallet_core_1 = __importDefault(require("./wallet@core"));
const p2p_1 = __importDefault(require("./p2p"));
const assets_1 = __importDefault(require("./assets"));
const transactions_1 = __importDefault(require("./transactions"));
const routes = (0, express_1.Router)();
routes.use('/auth/', auth_1.default);
routes.use('/user/', users_1.default);
routes.use('/pin/', pin_1.default);
routes.use('/notification/', notifications_1.default);
routes.use('/profile/', profile_1.default);
routes.use('/assets/', assets_1.default);
routes.use('/p2p/', p2p_1.default);
routes.use('/transactions/', transactions_1.default);
routes.use('/webhooks/', webhooks_1.default);
// wallet core service
routes.use('/core/', wallet_core_1.default);
routes.get('/', (req, res) => {
    res.status(200).send({ status: true, data: {}, message: "Welcome to Tencoin! We’re excited to have you onboard.  🚀🚀🛰🛰" });
});
exports.default = routes;
//# sourceMappingURL=index.js.map