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
const console_1 = require("console");
const sumsubClient_1 = __importDefault(require("../../../configs/sumsubClient"));
const createApplicant_1 = require("../../../thirdparty/sumsub/createApplicant");
const logPrefix = "PROFILE:SUMSUB:CONTROLLER";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = req.user;
        console.log(`${logPrefix} init ===> user id: ${user.id} `);
        const externalUserId = `sendless_${user.id}`;
        let applicant;
        try {
            // Try creating a new applicant
            applicant = yield (0, createApplicant_1.createApplicant)({
                externalUserId,
                email: user === null || user === void 0 ? void 0 : user.email,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                info: {
                    firstName: user === null || user === void 0 ? void 0 : user.firstName,
                    lastName: user === null || user === void 0 ? void 0 : user.lastName,
                }
            });
            (0, console_1.log)(`${logPrefix} ✅ Applicant created: ${JSON.stringify(applicant)}`);
        }
        catch (err) {
            // Handle duplicate applicant (409 conflict)
            if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 409) {
                const description = ((_b = err.response.data) === null || _b === void 0 ? void 0 : _b.description) || "";
                const existingApplicantIdMatch = description.match(/([a-f0-9]{24})$/); // extract Sumsub applicantId
                const existingApplicantId = existingApplicantIdMatch ? existingApplicantIdMatch[1] : null;
                (0, console_1.log)(`${logPrefix} ⚠️ Applicant already exists with externalUserId=${externalUserId}, applicantId=${existingApplicantId}`);
                applicant = { id: existingApplicantId, externalUserId }; // fallback
            }
            else {
                throw err; // rethrow other errors
            }
        }
        // ✅ Always use externalUserId when generating token
        const resp = yield sumsubClient_1.default.post(`/resources/accessTokens?userId=${externalUserId}&levelName=kyc-level`, null);
        (0, console_1.log)(`${logPrefix} sumsub response ===> ${JSON.stringify(resp.data)}`);
        return res.status(200).send({
            status: true,
            data: {
                applicantId: applicant === null || applicant === void 0 ? void 0 : applicant.id,
                externalUserId,
                token: resp.data.token,
            },
            message: "Token generated successfully",
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map