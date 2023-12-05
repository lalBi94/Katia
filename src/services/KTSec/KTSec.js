import axios from "axios";
const KS_K = 43870257;

/**
 * Chiffrement des requetes clientes
 * @param {string} w Chaine a chiffrer
 * @return {?string}
 */
const KCEncrypt = (w) => {
	try {
		let newW = "";

		for (let i = 0; i < w.length; ++i) {
			newW += `@@${(w.charCodeAt(i) + 1 * KS_K * i).toString(16)}##.`;
		}

		return newW;
	} catch (err) {
		return null;
	}
};

/**
 * Dechiffrement des reponses serveur
 * @param {string} w Chaine a dechiffrer
 * @return {?string}
 */
const KSDecrypt = (w) => {
	try {
		const splitedW = w.split("##.");
		let newW = "";

		for (let i = 0; i < splitedW.length - 1; ++i) {
			const toTransform = splitedW[i].slice(2);
			const uncrypt = parseInt(toTransform, 16) + KS_K * i;
			newW += String.fromCharCode(uncrypt);
		}

		return newW;
	} catch (err) {
		return null;
	}
};

/**
 * Creer une requete chiffrer
 * @param {string} data Donnees modifier par une des 2 fn ci-dessus
 * @param {string} where Url de l'API
 * @return {Promise<{}>}
 */
const cipherRequest = (data, where) => {
	return new Promise((resolve, reject) => {
		try {
			const clientcr = KCEncrypt(data);

			axios.post(where, { data: clientcr }, {
				headers: {
					'Access-Control-Allow-Origin': '*'
				}
			}).then((res) => {
				const serverdcr = KSDecrypt(res.data);
				resolve(JSON.parse(serverdcr));
			}).catch((err) => {
				reject(null)
			})
		} catch (err) {
			reject(null);
		}
	});
};

export { cipherRequest };
