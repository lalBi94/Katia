const KS_K = 9999;

/**
 * Server responses encryption.
 * @param {string} w String to encrypt.
 * @return {Promise<string>}
 */
const KSEncrypt = (w) => {
	try {
		let newW = "";

		for (let i = 0; i < w.length; ++i) {
			newW += `@@${(w.charCodeAt(i) - KS_K * i).toString(16)}##.`;
		}

		return newW;
	} catch (err) {
		return null;
	}
};

/**
 * Client request decryption.
 * @param {string} w String to decrypt.
 * @return {Promise<string>}
 */
const KCDecrypt = (w) => {
	try {
		const splitedW = w.split("##.");
		let newW = "";

		for (let i = 0; i < splitedW.length - 1; ++i) {
			const toTransform = splitedW[i].slice(2);
			const uncrypt = parseInt(toTransform, 16) - 1 * KS_K * i;
			newW += String.fromCharCode(uncrypt);
		}

		return newW;
	} catch (err) {
		return null;
	}
};

module.exports = { KCDecrypt, KSEncrypt };
