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
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.createTable("refferal", (table) => {
            table.increments("id").primary();
            table.integer("user_id").unsigned();
            table.integer("peer_user_id").unsigned();
            table.foreign("user_id").references('id').inTable('users');
            table.foreign("peer_user_id").references('id').inTable('users');
            table.string("status").defaultTo("pending");
            table.text("meta");
            table
                .datetime("created_at", { useTz: true, precision: 6 })
                .defaultTo(knex.fn.now(6));
            table.datetime("updated_at", { useTz: true, precision: 6 });
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTableIfExists("refferal");
    });
}
exports.down = down;
//# sourceMappingURL=20240329065730_Refferal.js.map