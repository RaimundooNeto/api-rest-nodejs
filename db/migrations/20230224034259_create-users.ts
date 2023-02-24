import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('name', 100).notNullable()
    table.string('password', 100).notNullable()
    table.string('email', 50).unique().notNullable()
    table.string('cellphone', 14).unique().notNullable()
    table.boolean('is_admin').defaultTo(false).notNullable()
    table.boolean('is_online').defaultTo(false).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
