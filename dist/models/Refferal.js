"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const User_1 = __importDefault(require("./User"));
class Refferal extends objection_1.Model {
    static get tableName() {
        return "refferal";
    }
    static get idColumn() {
        return "id";
    }
    static get relationMappings() {
        return {
            user: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: User_1.default,
                filter: (query) => query.select("firstName", "lastName"),
                join: {
                    from: "refferal.peer_user_id",
                    to: "users.id",
                },
            },
        };
    }
}
exports.default = Refferal;
//# sourceMappingURL=Refferal.js.map