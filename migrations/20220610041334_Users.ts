import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
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
		table.string("country").notNullable().defaultTo("NGN");
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
}


export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("users");
}

