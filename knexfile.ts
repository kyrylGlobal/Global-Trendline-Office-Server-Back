const connect: any = {
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tabkeName: "knex_migrations",
            directory: "./migrations",

        }
    }
}

export default connect;