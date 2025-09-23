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
const User_1 = __importDefault(require("../../models/User"));
const Pin_1 = __importDefault(require("../../models/Pin"));
const Address_1 = __importDefault(require("../../models/Address"));
const VerificationDocuments_1 = __importDefault(require("../../models/VerificationDocuments"));
const redisConnection_1 = __importDefault(require("../../redis/redisConnection"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const kucoinClient_1 = __importDefault(require("../../configs/kucoinClient"));
const kucoin_universal_sdk_1 = require("kucoin-universal-sdk");
const subaccount_1 = require("kucoin-universal-sdk/dist/generate/account/subaccount");
const { AccessEnum } = kucoin_universal_sdk_1.Account.SubAccount.AddSubAccountReq;
const logPrefix = "[PROFILE:GETUSER:SERVICE]";
function generateUniqueSubAccountName(baseName) {
    // 1. Clean the base name:
    //    - Remove all non-alphanumeric characters (including spaces, punctuation, symbols)
    //    - Convert to a consistent case (optional, but often good for usernames)
    let cleanedName = baseName.trim().replace(/[^a-zA-Z0-9]/g, ''); // <-- MODIFIED LINE
    // If, after cleaning, the name is empty, we need a fallback.
    // This provides a default to build upon if the input was like "!" or "  "
    if (cleanedName.length === 0) {
        cleanedName = 'user'; // A simple fallback base name
    }
    // 2. Ensure it has at least one letter and one number for compliance.
    //    We'll prefix them for robustness, ensuring they aren't truncated later.
    if (!/[a-zA-Z]/.test(cleanedName)) {
        cleanedName = 'a' + cleanedName;
    }
    if (!/\d/.test(cleanedName)) {
        cleanedName = '1' + cleanedName;
    }
    // 3. Add a timestamp (milliseconds) for better uniqueness
    const timestamp = Date.now().toString();
    cleanedName += timestamp;
    // 4. Add a short random alphanumeric suffix for extra uniqueness
    const randomSuffixLength = 4; // You can adjust this length
    const alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const getRandomChar = () => alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)];
    let randomSuffix = '';
    for (let i = 0; i < randomSuffixLength; i++) {
        randomSuffix += getRandomChar();
    }
    cleanedName += randomSuffix;
    // 5. Pad to minimum length (7) if necessary
    //    (Unlikely to be needed after adding timestamp and random suffix, but good for safety)
    while (cleanedName.length < 7) {
        cleanedName += getRandomChar();
    }
    // 6. Truncate to maximum length (32) if necessary
    if (cleanedName.length > 32) {
        // Truncate from the right, keeping the important parts (cleaned base + prefixes + uniqueness suffix)
        cleanedName = cleanedName.substring(0, 32);
    }
    // Final sanity check (highly unlikely to fail after prefixing and padding, but defensive)
    // If somehow a name became too short after a complex sequence of truncations/cleaning,
    // ensure it's re-padded.
    while (cleanedName.length < 7 && /[a-zA-Z]/.test(cleanedName) && /\d/.test(cleanedName)) {
        cleanedName += getRandomChar();
    }
    return cleanedName;
}
exports.default = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    console.log(`${logPrefix} init ${userId}`);
    let formatedUser = {};
    let isPin = false;
    let isAddress = false;
    let isNextKin = false;
    let isDocs = false;
    // get user from redis
    const getUser = yield (0, redisConnection_1.default)({ type: "get", key: `users:${userId}`, value: null, time: null });
    if (!getUser) {
        const userProfile = yield User_1.default.query().findOne({ id: userId })
            .withGraphFetched("address");
        if (!userProfile) {
            throw new AppError_1.default("User profile not found", 400, logPrefix, {});
        }
        formatedUser = userProfile.user();
        (_a = userProfile === null || userProfile === void 0 ? void 0 : userProfile.address) === null || _a === void 0 ? true : delete _a.created_at;
        (_b = userProfile === null || userProfile === void 0 ? void 0 : userProfile.address) === null || _b === void 0 ? true : delete _b.updated_at;
        (_c = userProfile === null || userProfile === void 0 ? void 0 : userProfile.address) === null || _c === void 0 ? true : delete _c.id;
        (_d = userProfile === null || userProfile === void 0 ? void 0 : userProfile.address) === null || _d === void 0 ? true : delete _d.user_id;
        (_e = userProfile === null || userProfile === void 0 ? void 0 : userProfile.address) === null || _e === void 0 ? true : delete _e.deleted_at;
        formatedUser.address = Object.assign({}, userProfile === null || userProfile === void 0 ? void 0 : userProfile.address);
        const checkPin = yield Pin_1.default.query().findOne({ user_id: userId });
        if (checkPin) {
            isPin = true;
        }
        const checkAddress = yield Address_1.default.query().where({ user_id: userId });
        if (checkAddress.length > 0) {
            isAddress = true;
        }
        const checkDocs = yield VerificationDocuments_1.default.query().where({ user_id: userId, status: "successful" });
        if (checkDocs.length > 0) {
            isDocs = true;
        }
        formatedUser.isPin = isPin;
        formatedUser.isAddress = isAddress;
        formatedUser.isNextKin = isNextKin;
        formatedUser.isDocs = isDocs;
        yield (0, redisConnection_1.default)({ type: "lock", key: `users:${userProfile.id}`, value: JSON.stringify(formatedUser), time: 60 });
    }
    else {
        formatedUser = JSON.parse(getUser);
    }
    if (isDocs) {
        const subName = generateUniqueSubAccountName(formatedUser.email || formatedUser.phone);
        console.log("checking sub name ===> ", subName);
        const subAccountRequest = subaccount_1.AddSubAccountReq.create({
            access: AccessEnum.SPOT,
            password: formatedUser.email || formatedUser.phone,
            subName: subName,
            // REMOVE THE 'toJson' LINE COMPLETELY from here
        });
        const accountApi = (0, kucoinClient_1.default)().restService().getAccountService().getSubAccountApi().addSubAccount(subAccountRequest // Pass the created object here
        );
        accountApi
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Sub-account created successfully:', result);
            // Process the result if needed
            yield User_1.default.query().findOne({ id: userId }).update({ account: result.uid });
        }))
            .catch(error => {
            console.error('Failed to create sub-account:', error);
            // Handle the error appropriately
        });
    }
    return { statusCode: 200, status: "success", data: { user: formatedUser }, message: "User profile" };
});
//# sourceMappingURL=getUser.js.map