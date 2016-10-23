module.exports = {
  development: {
    client: 'postgresql',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      directory: `${__dirname}/db/migrations`,
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `${__dirname}/db/migrations`,
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `${__dirname}/db/migrations`,
      tableName: 'knex_migrations',
    },
  },
};
