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
        return knex.schema.createTable("verification_documents", (table) => {
            table.increments("id").primary();
            table.integer("user_id").unsigned();
            table.foreign("user_id").references('id').inTable('users');
            table.enu("type", [
                "id_card",
                "passport",
                "drivers",
                "bvn",
            ]).defaultTo("id_card");
            table.string("identifier").notNullable();
            table.string("reference");
            table.text("img");
            table.enu("status", [
                "pending",
                "successful",
                "failed",
            ]).defaultTo("pending");
            table.text("meta");
            table.datetime("verified_at", { useTz: true, precision: 6 });
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
        return knex.schema.dropTableIfExists("verification_documents");
    });
}
exports.down = down;
//# sourceMappingURL=20240116222001_verificationDocument.js.map