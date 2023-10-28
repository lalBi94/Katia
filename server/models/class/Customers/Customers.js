const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const CustomerSchema = require("./CustomerSchema");

/**
 * Managing Customers collection.
 * @name Customers
 * @version 1.0
 * @license MIT
 * @author General Zod (lalBi94)
 * @link https://github.com/lalBi94
 * @copyright © 2023 Boudjemline
 * @contact : bilal@boudjemline.fr
 */
class Customers {
    /**
     * @param {MongoClient} db The MongoDB object connection.
     */
    constructor(link) {
        this.link = link;

        this.status = {
            succes: 0,
            error: 1,
            account_already_registered: 2,
        };

        this.database = this.link.db("Customers");

        this.collections = {
            list: this.database.collection("list"),
            history: this.database.collection("history"),
        };
    }

    /**
     * Generate a token for customers.
     * @param {{firstname: string, lastname: string, email: string, password: string, createAt: Date}} user_data
     * @return {Promise<string>}
     */
    genToken(user_data) {
        return new Promise((resolve, reject) => {
            try {
                const token = jwt.sign(user_data, process.env.JWT_SECRET_KEY, {
                    expiresIn: "1h",
                });
                console.log(`?Token:: Generation ${token} [OK]`);
                resolve(token);
            } catch (err) {
                console.error(`?Token:: Generation [ERROR]`);
                reject(err);
            }
        });
    }

    /**
     * Decode token
     * @param {string} token
     * @return {Promise<{}>}
     */
    decodeToken(token) {
        return new Promise((resolve, reject) => {
            try {
                resolve(jwt.verify(token, process.env.JWT_SECRET_KEY));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Check if token is currently register in server
     * @param {string} token
     * @return {{status: 0|1}}
     */
    async verifyTokenValidity(token) {
        try {
            const decode = (await this.decodeToken(token)) || null;
            return { status: !decode ? this.status.error : this.status.succes };
        } catch (err) {
            return { status: this.status.error };
        }
    }

    /**
     * Set a new Customer in database.
     * @param {string} firstname
     * @param {string} lastname
     * @param {string} email
     * @param {string} password
     * @return {{status: number} | {status: number, token: string}}
     */
    async register(firstname, lastname, email, password) {
        try {
            const founded_user = await this.collections.list.findOne({
                email: email,
                password: password,
            });

            if (founded_user)
                return { status: this.status.account_already_registered };

            let schematic = new CustomerSchema(
                firstname,
                lastname,
                email,
                password
            );
            let final_schematic = await schematic.getObject();

            const result = await this.collections.list.insertOne(
                final_schematic
            );

            if (result.insertedId) {
                const user_data = await this.collections.list.findOne({
                    _id: result.insertedId,
                });
                const token = await this.genToken(user_data);

                console.log(
                    `?Register:: ${firstname} ${lastname} with ID=${result.insertedId} [OK]`
                );
                return { status: this.status.succes, token: token };
            }
        } catch (err) {
            console.error(`?Register:: ${firstname} ${lastname} [ERROR]`);
            return { status: this.status.error };
        }
    }

    /**
     * Log a client and send token
     * @param {string} email
     * @param {string} password
     * @return {string}
     */
    async login(email, password) {
        console.log(`?Login:: try ${email} [...]`);

        try {
            const flag = await this.collections.list.findOne({
                email: email,
                password: password,
            });

            if (flag) {
                const token = await this.genToken(flag);
                console.log(`?Login:: ${email} [OK]`);
                return token;
            }
        } catch (err) {
            console.error(`?Login:: ${email} [ERROR]`);
            return null;
        }
    }

    /**
     * Get user data
     * @param {string} token
     * @return {{}}
     */
    async getInfo(token) {
        try {
            const decoded = await this.decodeToken(token);
            delete decoded.password;

            if (decoded) return { status: this.status.succes, data: decoded };
        } catch (err) {
            return { status: this.status.error };
        }
    }
}

module.exports = Customers;
