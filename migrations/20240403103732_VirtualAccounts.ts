import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("virtual_accounts", (table) => {
		table.increments("id").primary();
        table.integer("user_id").unsigned();
		table.foreign("user_id").references('id').inTable('users');
		table.string("bank_name");
		table.string("account_number").unique().notNullable();
		table.string("provider_reference");
		table.string("provider");
		table.string("currency").notNullable().defaultTo("NGN");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("virtual_accounts");
}

