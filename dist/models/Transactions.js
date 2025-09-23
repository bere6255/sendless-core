"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const User_1 = __importDefault(require("./User"));
class Transactions extends objection_1.Model {
    // Table name is the only required property.
    static get tableName() {
        return "transactions";
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
                    from: "transactions.user_id",
                    to: "users.id",
                },
            },
            peeruser: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: User_1.default,
                filter: (query) => query.select("firstName", "lastName"),
                join: {
                    from: "transactions.user_id",
                    to: "users.id",
                },
            }
        };
    }
}
exports.default = Transactions;
//# sourceMappingURL=Transactions.js.map