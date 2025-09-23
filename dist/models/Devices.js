"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Devices extends objection_1.Model {
    // Table name is the only required property.
    static get tableName() {
        return "devices";
    }
    static get idColumn() {
        return "id";
    }
}
exports.default = Devices;
//# sourceMappingURL=Devices.js.map