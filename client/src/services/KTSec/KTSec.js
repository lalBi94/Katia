import axios from "axios";
const KS_K = 9999;

/**
 * Client request encryption.
 * @param {string} w String to encrypt.
 * @return {Promise<string>}
 */
const KCEncrypt = (w) => {
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
 * Server response decryption.
 * @param {string} w String to decrypt.
 * @return {Promise<string>}
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
 * Create a cipher request
 * @param {string} data Data to send.
 * @param {string} where target url.
 * @return {Promise<{}>}
 */
const cipherRequest = (data, where) => {
    return new Promise((resolve, reject) => {
        try {
            const clientcr = KCEncrypt(data);

            axios.post(where, { data: clientcr }).then((res) => {
                const serverdcr = KSDecrypt(res.data);
                resolve(JSON.parse(serverdcr));
            });
        } catch (err) {
            reject(null);
        }
    });
};

export { cipherRequest };
