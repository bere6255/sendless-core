import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
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
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("verification_documents");
}

