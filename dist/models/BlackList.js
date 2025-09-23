"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class BlackList extends objection_1.Model {
    // Table name is the only required property.
    static get tableName() {
        return "black_list";
    }
    static get idColumn() {
        return "id";
    }
}
exports.default = BlackList;
//# sourceMappingURL=BlackList.js.map