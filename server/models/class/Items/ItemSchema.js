/**
 * Item data schematic..
 * @name ItemSchema
 * @version 1.0
 * @license MIT
 * @author General Zod (lalBi94)
 * @link https://github.com/lalBi94
 * @copyright © 2023 Boudjemline
 * @contact : bilal@boudjemline.fr
 */
class ItemSchema {
	/**
	 * @param {string} name Name of item
	 * @param {number} price Price of item
	 * @param {number} promotion Promotion of item
	 * @param {string} imgRef Link reference of item
	 */
	constructor(name, price, promotion, imgRef) {
		this.name = name;
		this.price = price;
		this.promotion = promotion;
		this.imgRef = imgRef;
	}

	/**
	 * Create a JSON to send to Database.
	 * @return {{name: string, price: number, promotion: number}}
	 */
	async getObject() {
		return new Promise((resolve, reject) => {
			try {
				resolve({
					name: this.name,
					price: this.price,
					promotion: this.promotion,
					imgRef: this.imgRef,
				});
			} catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = ItemSchema;
