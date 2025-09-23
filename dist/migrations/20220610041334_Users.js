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
        return knex.schema.createTable("users", (table) => {
            table.increments("id").primary();
            table.string("full_name");
            table.string("tag").unique();
            table.string("phone").unique();
            table.string("email").unique();
            table.string("avatar");
            table.enu("type", [
                "user",
            ]).defaultTo("user");
            table.enu("status", [
                "pending_kyc", "active"
            ]).defaultTo("pending_kyc");
            table.string("notification").notNullable().defaultTo(1);
            table.datetime("email_verified_at", { useTz: true, precision: 6 });
            table.datetime("phone_verified_at", { useTz: true, precision: 6 });
            table.string("password").notNullable();
            table.string("country").notNullable().defaultTo("NG");
            table.integer("login_attempts").notNullable().defaultTo(0);
            table.integer("reset_password_attempts").notNullable().defaultTo(0);
            table.string("remember_token");
            table
                .datetime("created_at", { useTz: true, precision: 6 })
                .defaultTo(knex.fn.now(6));
            table.datetime("updated_at", { useTz: true, precision: 6 });
            table.datetime("banned_at", { useTz: true, precision: 6 });
            table.datetime("deleted_at", { useTz: true, precision: 6 });
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTableIfExists("users");
    });
}
exports.down = down;
//# sourceMappingURL=20220610041334_Users.js.map