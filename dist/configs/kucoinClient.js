"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const kucoin_universal_sdk_1 = require("kucoin-universal-sdk");
const key = process.env.KC_API_KEY || "";
const secret = process.env.KC_API_SECRET || "";
const passphrase = process.env.KC_API_PASSPHRASE || "";
const KC_BROKER_NAME = process.env.KC_BROKER_NAME || "";
const KC_BROKER_PARTNER = process.env.KC_BROKER_PARTNER || "";
const secretBroker = process.env.KC_BROKER_KEY || "";
exports.default = () => {
    // Set specific options, others will fall back to default values
    var httpTransportOption = new kucoin_universal_sdk_1.TransportOptionBuilder()
        .setKeepAlive(true)
        .setMaxConnsPerHost(10)
        .setMaxIdleConns(10)
        .build();
    // Create a client using the specified options
    var clientOption = new kucoin_universal_sdk_1.ClientOptionBuilder()
        .setKey(key)
        .setSecret(secret)
        .setPassphrase(passphrase)
        .setSpotEndpoint(kucoin_universal_sdk_1.GlobalApiEndpoint)
        .setFuturesEndpoint(kucoin_universal_sdk_1.GlobalFuturesApiEndpoint)
        .setBrokerEndpoint(kucoin_universal_sdk_1.GlobalBrokerApiEndpoint)
        .setBrokerKey(secretBroker)
        .setBrokerName(KC_BROKER_NAME)
        .setBrokerPartner(KC_BROKER_PARTNER)
        .setTransportOption(httpTransportOption)
        .build();
    return new kucoin_universal_sdk_1.DefaultClient(clientOption);
};
//# sourceMappingURL=kucoinClient.js.map