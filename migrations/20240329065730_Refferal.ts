import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
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
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("refferal");
}

