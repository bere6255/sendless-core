import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("token", (table) => {
		table.increments("id").primary();
		table.string("identifier").notNullable();
		table.string("type").notNullable();
		table.integer("token").notNullable();
		table.integer("validity").notNullable();
		table
			.datetime("created_at", { useTz: true, precision: 6 })
			.defaultTo(knex.fn.now(6));
		table.datetime("updated_at", { useTz: true, precision: 6 });
	});
}


export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("token");
}

