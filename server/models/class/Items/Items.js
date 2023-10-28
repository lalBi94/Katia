const { 
    MongoClient,
} = require("mongodb")

const ItemSchema = require("./ItemSchema")

/**
 * Managing Items collection.
 * @name Items
 * @version 1.0
 * @license MIT
 * @author General Zod (lalBi94)
 * @link https://github.com/lalBi94
 * @copyright © 2023 Boudjemline
 * @contact : bilal@boudjemline.fr
 */
class Items {
    /**
     * @param {MongoClient} link The MongoDB object connection.
     */
    constructor(link) {
        this.link = link

        this.database = this.link.db("Items")
        
        this.collections = {
            list: this.database.collection("list")
        }
    }

    /**
     * Set item in database.
     * @param {string} name 
     * @param {number} price 
     * @param {number} promotion
     * @param {string} imgRef
     * @return {Promise<string|null>} 
     */
    async setItem(name, price, promotion, imgRef) {
        let schematic = new ItemSchema(name, price, promotion, imgRef)

        try {
            const result = await this.collections.list.insertOne(schematic.getObject())
            return result.insertedId ? result.insertedId : null
        } catch (err) {
            return null
        }
    }
}

module.exports = Items