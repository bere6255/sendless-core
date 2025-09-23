"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class VirtualAccounts extends objection_1.Model {
    static get tableName() {
        return "virtual_accounts";
    }
    static get idColumn() {
        return "id";
    }
    static get relationMappings() {
        return {};
    }
}
exports.default = VirtualAccounts;
//# sourceMappingURL=VirtualAccounts.js.map