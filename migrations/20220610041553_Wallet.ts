import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("wallets", (table) => {
		table.increments("id").primary();
        table.integer("user_id").unsigned();
		table.foreign("user_id").references('id').inTable('users');
		table.bigInteger("amount").notNullable().defaultTo(0);
		table.string("type").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}


export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("wallets");
}

