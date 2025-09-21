import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("address", (table) => {
		table.increments("id").primary();
        table.integer("user_id").unsigned();
		table.foreign("user_id").references('id').inTable('users');
		table.text("address").nullable();
		table.string("city").nullable();
		table.string("state").nullable();
		table.string("country").notNullable();
		table.enu("status", [
			"pending",
			"successful",
			"failed",
		]).defaultTo("pending");
		table.datetime("verified_at", { useTz: true, precision: 6 });
		table
			.datetime("created_at", { useTz: true, precision: 6 })
			.defaultTo(knex.fn.now(6));
		table.datetime("updated_at", { useTz: true, precision: 6 });
		table.datetime("deleted_at", { useTz: true, precision: 6 });
	});
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("address");
}

