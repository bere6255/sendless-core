"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Address extends objection_1.Model {
    // Table name is the only required property.
    static get tableName() {
        return "address";
    }
    static get idColumn() {
        return "id";
    }
}
exports.default = Address;
//# sourceMappingURL=Address.js.map