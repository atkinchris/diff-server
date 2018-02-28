const knex = require('knex')
const uuid = require('uuid')

const now = () => (new Date()).toISOString()

const buildDb = async () => {
  const db = knex({
    client: 'sqlite3',
    connection: { filename: './db.sqlite' },
    useNullAsDefault: true,
  })

  const tableName = 'nominations'

  const tableExists = await db.schema.hasTable(tableName)

  if (!tableExists) {
    await db.schema.createTable(tableName, (table) => {
      table.increments('id').primary()
      table.string('nomination').notNullable()
      table.string('space').notNullable()
      table.integer('shelf').notNullable()
      table.string('sku')
      table.string('comment')
      table.dateTime('effective_from').notNullable()
      table.dateTime('effective_to')
    })
  }

  const getAll = () => db
    .select()
    .from(tableName)
    .where({ effective_to: null })

  const getAllChanges = (from, to = now()) => db
    .select()
    .from(tableName)
    .whereBetween('effective_from', [from, to])
    .orderBy('nomination')
    .orderBy('effective_from', 'desc')

  const get = id => db
    .first()
    .from(tableName)
    .where({
      nomination: id,
      effective_to: null,
    })

  const insert = (body) => {
    const nomination = Object.assign({}, body, {
      effective_from: now(),
      nomination: uuid.v4(),
    })
    return db.insert(nomination).into(tableName)
  }

  const remove = async (id) => {
    const latest = await get(id)

    return db
      .from(tableName)
      .where({ id: latest.id })
      .update({ effective_to: now() })
  }

  const update = async (id, body) => {
    const latest = await get(id)
    const next = Object.assign({}, latest, body, {
      id: undefined,
      nomination: id,
      effective_from: now(),
      effective_to: null,
    })

    return db.transaction(async (trx) => {
      if (!latest.effective_to) {
        await trx
          .from(tableName)
          .where({ nomination: id })
          .update({ effective_to: next.effective_from })
      }

      await trx
        .insert(next)
        .into(tableName)

      return trx
    })
  }

  return {
    getAll,
    getAllChanges,
    get,
    insert,
    remove,
    update,
  }
}

module.exports = buildDb
