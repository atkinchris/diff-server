const knex = require('knex')

const buildDb = () => {
  const db = knex({
    client: 'sqlite3',
    connection: { filename: './db.sqlite' },
    useNullAsDefault: true,
  })

  db.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('nomination').notNullable()
    table.string('space').notNullable()
    table.integer('shelf').notNullable()
    table.string('sku')
    table.string('comment')
    table.dateTime('effective_from').notNullable()
    table.dateTime('effective_to').nullable()
  })
}

module.exports = buildDb
