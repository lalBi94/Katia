import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { cipherRequest } from "../../services/KTSec/KTSec";
import "./Cart.scss";
import { Vortex } from "react-loader-spinner";
import { Link } from "react-router-dom";
import "hover.css";
import RCode from "../../components/RCode/RCode";
import config from "../../global.json";

/**
 * Panier du client
 * @return {HTMLElement}
 */
export default function Cart() {
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [lockdown, setLockdown] = useState(true);
	const [loader, setLoader] = useState(true);
	const [codeQR, setCodeQR] = useState(null);

	/**
	 * Envoyer le panier dans les reservations
	 * @return {void}
	 */
	const buy = () => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
			items_list: data,
			total: total,
		});

		setLoader(true);

		cipherRequest(toSend, `${config.api}/reservation/addReservation`).then(
			(res) => {
				setCodeQR({
					codeqr: res.codeqr,
					text: res.codetxt,
					total: res.total,
				});
				setLockdown(false);
				setData(null);
				setTotal(0);
				console.log(res);
				setLoader(false);
			}
		);
	};

	/**
	 * Supprimer un produit du panier
	 * @param {string} item_id Identifiant du produit
	 * @param {number} id Index du produit dans la liste
	 * @return {Promise<void>}
	 */
	const removeItem = (item_id, id) => {
		return new Promise((_, __) => {
			const toSend = JSON.stringify({
				token: localStorage.getItem("katiacm"),
				item_id: item_id,
			});

			cipherRequest(toSend, `${config.api}/order/removeItem`).then(
				(res) => {
					console.log(res);
					const cpy = [...data];
					cpy.splice(id, 1);

					setData(data.length > 1 ? cpy : null);
					calculTotal(cpy);

					setLockdown(false);
				}
			);
		});
	};

	/**
	 * Supprimer l'integralite du panier
	 * @return {Promise<void>}
	 */
	const clearCart = () => {
		for (let i = 0; i <= data.length - 1; ++i) {
			removeItem(data[i]._id, i);
		}

		location.reload()
	};

	/**
	 * Augmenter ou baisser la quantite
	 * @param {string} item_id Identifiant du produit
	 * @param {"+"|"-"} action Choisir si on veut augmenter/diminuer la quantite
	 * @param {number} count Quantite du produit
	 * @param {number} id Index du produit dans la liste
	 * @return {void}
	 */
	const addOrRemoveOneToItemOrder = (item_id, action, count, id) => {
		if (parseInt(count, 10) === 1 && action === "-") {
			removeItem(item_id, id);
		}

		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
			item_id: item_id,
			sign: action,
		});

		cipherRequest(
			toSend,
			`${config.api}/order/addOrRemoveOneToItemOrder`
		).then((res) => {
			switch (res.status) {
				case 0: {
					const cpy = [...data];

					for (let i = 0; i <= cpy.length - 1; ++i) {
						if (cpy[i]._id === item_id) {
							action === "+" ? cpy[i].qte++ : cpy[i].qte--;
							setData(cpy);
							calculTotal(cpy);
						}
					}

					break;
				}
			}

			setLockdown(false);
		});
	};

	/**
	 * Calculer le total du panier
	 * @param {Array<{}>} data
	 */
	const calculTotal = (data) => {
		const parsedData = data.map((item) => {
			return {
				price: parseFloat(item.price),
				qte: parseInt(item.qte),
			};
		});

		const total = parsedData.reduce((acc, item) => {
			return acc + item.price * item.qte;
		}, 0);

		setTotal(total.toFixed(2));
	};

	useEffect(() => {
		if (!localStorage.getItem("katiacm"))
			window.location.href = "/Katia/#/gate";

		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
		});

		cipherRequest(toSend, `${config.api}/customer/getInfo`).then((res) => {
			if (!res) {
				localStorage.removeItem("katiacm");
				window.location.href = "/Katia/#/gate";
			}
		});

		cipherRequest(toSend, `${config.api}/order/getOrdersOf`).then((res) => {
			switch (res.status) {
				case 0: {
					if (res.data.length === 0) {
						setData(null);
						setLoader(false);
						return;
					}

					setData(res.data);
					calculTotal(res.data);
					setLockdown(false);
					break;
				}

				case 1: {
					localStorage.removeItem("katiacm");
					window.location.href = "/Katia/#/gate";
					break;
				}
			}

			setLoader(false);
		});
	}, []);

	return (
		<Layout>
			{codeQR ? (
				<div id="codeQR-big-container">
					<h2>
						Votre commande a été validée.
						<br />
						<span id="codeQR-thx">Merci pour votre achat !</span>
					</h2>

					<table id="codeQR-container">
						<thead id="codeQR-headers">
							<tr id="codeQR-headers-line">
								<th className="codeQR-header">Code QR</th>
								<th className="codeQR-header">
									Code de reservation
								</th>
								<th className="codeQR-header">Montant (TTC)</th>
							</tr>
						</thead>

						<tbody id="codeQR-datas">
							<tr id="codeQR-datas-line">
								<td className="codeQR-data">
									<img
										src={codeQR.codeqr}
										alt={`Code QR contenant le texte : ${codeQR.text}`}
									/>
								</td>

								<td className="codeQR-data res">
									<RCode code={codeQR.text} />
								</td>

								<td className="codeQR-data">
									<span>{codeQR.total}€</span>
								</td>
							</tr>
						</tbody>
					</table>

					<Link
						id="codeQR-redirection"
						className="hvr-shrink"
						to="/customer"
					>
						Aller sur votre <b>Espace Client</b>
					</Link>
				</div>
			) : null}

			{loader ? (
				<div className="loader">
					<Vortex
						visible={true}
						height="100"
						width="100"
						radius={1}
						ariaLabel="vortex-loading"
						wrapperStyle={{}}
						wrapperClass="vortex-wrapper"
						colors={[
							"#cedbfe",
							"#fecfef",
							"#cedbfe",
							"#fecfef",
							"#cedbfe",
							"#fecfef",
						]}
					/>
				</div>
			) : null}

			{data ? (
				<div id="cart-container">
					<table id="cart-items-container">
						<thead id="cart-item-thead">
							<tr>
								<th className="cart-items-titles">
									Nom du produit
								</th>
								<th className="cart-items-titles">Quantité</th>
								<th className="cart-items-titles">Prix</th>
								<th className="cart-items-titles">Actions</th>
							</tr>
						</thead>

						<tbody id="cart-item-tbody">
							{Object.keys(data).map((v, k) => (
								<tr className="cart-items" key={k}>
									<td className="cart-item-name">
										{data[v].name}
										<span className="cart-item-price">
											{data[v].price}€/u
										</span>
									</td>
									<td className="cart-item-qte">
										x{data[v].qte}
									</td>
									<td className="cart-item-final-price">
										{data[v].price * data[v].qte}€
									</td>
									<td className="cart-item-actions">
										<button
											disabled={lockdown}
											className="cart-item-btn minus hvr-shrink"
											onClick={() => {
												setLockdown(true);
												addOrRemoveOneToItemOrder(
													data[v]._id,
													"-",
													data[v].qte,
													v
												);
											}}
										>
											-
										</button>

										<button
											disabled={lockdown}
											className="cart-item-btn plus hvr-shrink"
											onClick={() => {
												setLockdown(true);
												addOrRemoveOneToItemOrder(
													data[v]._id,
													"+",
													data[v].qte,
													v
												);
											}}
										>
											+
										</button>

										<button
											disabled={lockdown}
											className="cart-item-btn remove hvr-shrink"
											onClick={() => {
												setLockdown(true);
												removeItem(data[v]._id, v);
											}}
										>
											×
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div id="cart-total-container">
						<div id="cart-total-btns">
							<button
								className="cart-total-btn btn hvr-shrink"
								disabled={lockdown}
								onClick={() => {
									setLockdown(true);
									buy();
								}}
							>
								Réserver ({total}€ TTC)
							</button>

							<button
								className="cart-total-btn btn hvr-shrink"
								onClick={() => {
									setLockdown(true);
									clearCart();
								}}
								disabled={lockdown}
							>
								Vider le panier
							</button>

							<button
								className="cart-total-btn btn hvr-shrink"
								disabled={lockdown}
								onClick={() => {
									setLockdown(true);
								}}
							>
								Retourner à la boutique
							</button>
						</div>
					</div>
				</div>
			) : null}
		</Layout>
	);
}
