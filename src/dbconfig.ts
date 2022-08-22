import connect from "./knexfile";
import knex from 'knex';

const dbEngine = process.env.DB_ENVIRONMENT || "development";
const config = connect[dbEngine];

export default knex(config);