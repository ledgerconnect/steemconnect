module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/steemconnect',
    migrations: {
      directory: `${__dirname}/db/migrations`,
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: process.env.POSTGRES_URL,
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
    connection: process.env.POSTGRES_URL,
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
