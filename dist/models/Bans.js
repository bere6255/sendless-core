"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Bans extends objection_1.Model {
    // Table name is the only required property.
    static get tableName() {
        return "bans";
    }
    static get idColumn() {
        return "id";
    }
}
exports.default = Bans;
//# sourceMappingURL=Bans.js.map