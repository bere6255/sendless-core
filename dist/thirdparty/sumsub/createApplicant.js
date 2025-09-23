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
exports.createApplicant = void 0;
// createApplicant.ts
const sumsubClient_1 = __importDefault(require("../../configs/sumsubClient"));
function createApplicant(applicant) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = (yield sumsubClient_1.default.post('/resources/applicants?levelName=id-only', applicant, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }));
            console.log('✅ Applicant created:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error creating applicant:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    });
}
exports.createApplicant = createApplicant;
//# sourceMappingURL=createApplicant.js.map