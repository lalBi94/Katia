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
        this.createdAt = Date.now();
    }

    /**
     * Create a JSON to send to Database.
     * @return {{firstname: string, lastname: string, email: string, password: string, createdAt: Date}}
     */
    async getObject() {
        return new Promise((resolve, reject) => {
            try {
                resolve({
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password,
                    createdAt: this.createdAt,
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = CustomerSchema;
