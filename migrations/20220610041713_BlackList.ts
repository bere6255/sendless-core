import { Knex } from "knex";

// move to redis

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("black_list", (table) => {
		table.increments("id").primary();
		table.text("token").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}


export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("black_list");
}

