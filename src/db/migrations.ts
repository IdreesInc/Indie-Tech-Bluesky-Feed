import { Kysely, Migration, MigrationProvider } from 'kysely'

const migrations: Record<string, Migration> = {}

export const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return migrations
  },
}

migrations['001'] = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createTable('post')
      .addColumn('uri', 'varchar', (col) => col.primaryKey())
      .addColumn('cid', 'varchar', (col) => col.notNull())
      .addColumn('first_indexed', 'integer', (col) => col.notNull())
      .addColumn('score', 'integer', (col) => col.notNull())
      .addColumn('last_scored', 'integer', (col) => col.notNull())
      .addColumn('mod', 'integer', (col) => col.notNull())
      .execute()
    await db.schema
      .createTable('sub_state')
      .addColumn('service', 'varchar', (col) => col.primaryKey())
      .addColumn('cursor', 'integer', (col) => col.notNull())
      .execute()
  },
  async down(db: Kysely<unknown>) {
    await db.schema.dropTable('post').execute()
    await db.schema.dropTable('sub_state').execute()
  },
}

migrations['002'] = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createTable('rick_roll_post')
      .addColumn('uri', 'varchar', (col) => col.primaryKey())
      .addColumn('cid', 'varchar', (col) => col.notNull())
      .addColumn('first_indexed', 'integer', (col) => col.notNull())
      .addColumn('score', 'integer', (col) => col.notNull())
      .addColumn('last_scored', 'integer', (col) => col.notNull())
      .addColumn('mod', 'integer', (col) => col.notNull())
      .addColumn('first_word', 'varchar', (col) => col.notNull())
      .execute()
  },
  async down(db: Kysely<unknown>) {
    await db.schema.dropTable('rick_roll_post').execute()
  }
}