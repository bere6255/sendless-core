import * as dotenv from "dotenv";
dotenv.config()
// Update with your config settings.
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_HOST = process.env.DB_HOST;
// const socketPath = process.env.DB_SOCKET;
export default {
	development:  {
		client: "mysql2",
		connection: {
			host: DB_HOST,
			port: 3306,
			database: DB_DATABASE,
			user: DB_USERNAME,
			password: DB_PASSWORD,
			// charset: "utf8mb4_bin",
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
	production:  {
		client: "mysql2",
		connection: {
			host: DB_HOST,
			port: 3306,
			database: DB_DATABASE,
			user: DB_USERNAME,
			password: DB_PASSWORD,
			// charset: "utf8mb4_bin",
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	}
}



