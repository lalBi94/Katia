const { MongoClient, ServerApiVersion } = require("mongodb");

/**
 * Managing database connection
 * @name Database
 * @version 1.0
 * @dependency mongodb
 * @license MIT
 * @author General Zod (lalBi94)
 * @link https://github.com/lalBi94
 * @copyright © 2023 Boudjemline
 * @contact : bilal@boudjemline.fr
 */
class Database {
	constructor() {
		this.link = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@douze.oa3bfdn.mongodb.net/?retryWrites=true&w=majority`;

		this.client = new MongoClient(this.link, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});

		this.colors = {
			logColor: "\x1b[43m\x1b[30m",
			errorColor: "\x1b[41m\x1b[30m",
			reset: "\x1b[0m",
		};
	}

	/**
	 * Create connection link.
	 * @return {void}
	 */
	async test() {
		try {
			await this.client.connect();

			await this.client.db("admin").command({ ping: 1 });

			console.log(
				`${this.colors.logColor}?Database:: [OK]${this.colors.reset}`
			);
		} catch (err) {
			await this.client.close();

			console.error(
				`${this.colors.errorColor}?Database:: [ERR]${this.colors.reset}`,
				err
			);
			process.exit(1);
		}
	}

	getConnection() {
		return this.client;
	}
}

module.exports = Database;
