"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect = {
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
};
exports.default = connect;
