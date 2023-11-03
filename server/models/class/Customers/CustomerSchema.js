/**
 * Customer data schematic.
 * @name CustomerSchema
 * @version 1.0
 * @license MIT
 * @author General Zod (lalBi94)
 * @link https://github.com/lalBi94
 * @copyright © 2023 Boudjemline
 * @contact : bilal@boudjemline.fr
 */
class CustomerSchema {
	/**
	 * @param {string} firstname Firstname of the customer.
	 * @param {string} lastname Lastname of the customer.
	 * @param {string} password Lastname of the customer.
	 */
	constructor(firstname, lastname, email, password) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.fidelityPoint = 0.0;
		this.type = "regular";
		this.createdAt = Date.now();
	}

	/**
	 * Create a JSON to send to Database.
	 * @return {Promise<{firstname: string, lastname: string, email: string, fidelityPoint: string, password: string, type: string, createdAt: Date}>}
	 */
	async getObject() {
		return new Promise((resolve, reject) => {
			try {
				resolve({
					firstname: this.firstname,
					lastname: this.lastname,
					email: this.email,
					fidelityPoint: this.fidelityPoint,
					password: this.password,
					type: this.type,
					createdAt: this.createdAt,
				});
			} catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = CustomerSchema;
