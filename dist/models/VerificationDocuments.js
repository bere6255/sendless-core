"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class VerificationDocuments extends objection_1.Model {
    // Table name is the only required property.
    static get tableName() {
        return "verification_documents";
    }
    static get idColumn() {
        return "id";
    }
}
exports.default = VerificationDocuments;
//# sourceMappingURL=VerificationDocuments.js.map