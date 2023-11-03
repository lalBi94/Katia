const { MongoClient, ObjectId } = require("mongodb");

const ItemSchema = require("./ItemSchema");

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
		this.link = link;

		this.status = {
			succes: 0,
			error: 1,
			items_already_registered: 2,
		};

		this.database = this.link.db("Items");

		this.collections = {
			list: this.database.collection("list"),
		};
	}

	/**
	 * Set item in database.
	 * @param {string} name
	 * @param {number} price
	 * @param {number} promotion
	 * @param {string} imgRef
	 * @return {Promise<{status: number}|null>}
	 */
	async setItem(name, price, promotion, imgRef) {
		try {
			const founded_item = await this.collections.list.findOne({
				name: name,
				price: price,
				promotion: promotion,
				imgRef: imgRef,
			});

			if (founded_item)
				return { status: this.status.items_already_registered };

			const schematic = new ItemSchema(name, price, promotion, imgRef);
			let final_schematic = await schematic.getObject();

			const result = await this.collections.list.insertOne(
				final_schematic
			);

			if (result.insertedId) {
				console.log(
					`?Item:: Adding ${name} for ${price}E with ID=${result.insertedId} [OK]`
				);
				return { status: this.status.succes };
			}
		} catch (err) {
			return null;
		}
	}

	/**
	 * Get all items.
	 * @return {Promise<Array<ItemSchema>|null>}
	 */
	async getAllItems() {
		try {
			const items = await this.collections.list.find().toArray();
			return items;
		} catch (err) {
			return null;
		}
	}

	/**
	 * Delete this list of items
	 * @param {Array<string>} items
	 * @return {Promise<{status: number}|null>}
	 */
	async deleteItems(items) {
		try {
			for (let i = 0; i <= items.length - 1; ++i) {
				await this.collections.list.deleteOne({
					_id: new ObjectId(items[i]),
				});
			}

			return { status: this.status.succes };
		} catch (err) {
			return { status: this.status.error };
		}
	}

	async modifyItem(id, name, price, promotion, imgRef) {
		try {
			const update = {
				$set: {
					name: name,
					price: price,
					promotion: promotion,
					imgRef: imgRef,
				},
			};

			const result = await this.collections.list.updateOne(
				{ _id: new ObjectId(id) },
				update
			);

			if (result.modifiedCount > 0) {
				return { status: this.status.succes };
			} else {
				return { status: this.status.error };
			}
		} catch (err) {
			return { status: this.status.error };
		}
	}
}

module.exports = Items;
