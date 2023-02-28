import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('subscribers', (table) => {
        table.uuid('id').primary()
        table.bigint('id_botconversa').notNullable()
        table.string('first_name', 50).notNullable()
        table.string('last_name', 50).notNullable()
        table.string('full_name', 100).notNullable()
        table.string('phone', 15).unique().notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('subscribers')
}
