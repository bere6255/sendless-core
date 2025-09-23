"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Token extends objection_1.Model {
    // Table name is the only required property.
    static get tableName() {
        return "token";
    }
    static get idColumn() {
        return "id";
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map