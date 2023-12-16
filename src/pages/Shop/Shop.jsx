import "./Shop.scss";
import Layout from "../../Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import "hover.css";
import { Vortex } from "react-loader-spinner";
import { motion } from "framer-motion";
import { cipherRequest } from "../../services/KTSec/KTSec";
import config from "../../global.json";
import StarsLine from "../../components/StarsLine/StarsLine";
import KNotif from "../../components/KNotif/KNotif";

/**
 * Page de la boutique
 * @return {HTMLElement}
 */
export default function Shop() {
	const [chunked, setChunked] = useState([[]]);
	const [current, setCurrent] = useState(0);
	const [clientId, setClientId] = useState(null);
	const [lockdown, setLockdown] = useState(false);
	const [combo, setCombo] = useState(1);
	const [notif, setNotif] = useState(null);

	/**
	 * Devisier le tableau en plusieurs chunks
	 * @param {*} r Liste d'objets
	 * @param {*} j Par combien diviser la liste
	 * @returns
	 */
	const chunks = (r, j) =>
		r.reduce(
			(a, b, i, g) => (!(i % j) ? a.concat([g.slice(i, i + j)]) : a),
			[]
		);

	/**
	 * Page de produits suivante
	 */
	const handleAfter = () => {
		setCurrent(current === chunked.length - 1 ? current : current + 1);
		window.scrollTo(0, 0);
		setLockdown(false);
	};

	/**
	 * Page de produits precedente
	 */
	const handleBefore = () => {
		setCurrent(current === 0 ? current : current - 1);
		window.scrollTo(0, 0);
		setLockdown(false);
	};

	const closeNotif = () => {
		setCombo(1);
		setNotif(null);
	};

	const openNotif = (title, message, status) => {
		setCombo(combo + 1);

		setNotif(
			<KNotif
				message={`${message} (x${combo})`}
				close={closeNotif}
				status={status}
			/>
		);
	};

	/**
	 * Ajouter un produit au panier
	 * @param {*} itemId Identifiant du produit
	 * @param {*} qte Quantite du produit
	 * @param {HTMLElement} element Tag du bouton selectionne
	 * @return {Promise<boolean>}
	 */
	const addToCart = (itemId, qte, element) => {
		return new Promise((resolve, reject) => {
			const e = element.target;
			e.style.background = "#d5ffcf";
			e.innerText = "Ajout en cours ...";

			if (!clientId) {
				window.location.href = "/Katia/#/gate";
			} else {
				const toSend = JSON.stringify({
					token_c: localStorage.getItem("katiacm"),
					itemId,
					qte,
				});

				cipherRequest(toSend, `${config.api}/order/addToCart`).then(
					(res) => {
						if (res.status === 0) {
							e.style.background = "#fdeb79";
							e.innerText = "+ Ajouter au panier";
							openNotif(
								"A la Carte",
								"Votre article a été deplacé dans le panier !",
								0
							);

							resolve(true);
						} else if (res.status === 1) {
							openNotif(
								"A la Carte",
								"Une erreur est survenue !",
								1
							);
							reject(false);
						}

						setLockdown(false);
					}
				);
			}
		});
	};

	const handleBuy = (itemId, qte, element) => {
		addToCart(itemId, qte, element).then((res) => {
			if (res) window.location.href = "/Katia/#/cart";
		});

		setLockdown(false);
	};

	useEffect(() => {
		axios.post(`${config.api}/item/getAllItems`).then((res) => {
			const newRes = chunks(res.data, 8);
			setChunked(newRes);
		});

		if (localStorage.getItem("katiacm")) {
			const toSend = JSON.stringify({
				token: localStorage.getItem("katiacm"),
			});

			cipherRequest(toSend, `${config.api}/customer/getUserId`).then(
				(res) => {
					setClientId(res);
				}
			);
		}
	}, []);

	return (
		<Layout>
			<div id="shop-container">
				{notif || null}

				<div id="shop-data-container">
					{chunked[current].length > 0 ? (
						Object.keys(chunked[current]).map((v, k) => (
							<motion.div
								initial={{ opacity: 0.5 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								duration={1500}
								key={k}
							>
								<div className="item-container hvr-float">
									<img
										className="item-imgRef"
										src={chunked[current][v].imgRef}
										alt={`Image de ${chunked[current][v].name}`}
									/>

									<motion.span
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="item-hover-actions"
									>
										<div className="item-hover-actions-blur"></div>

										<span className="text">
											{chunked[current][v].name}
										</span>
										<button
											disabled={lockdown}
											onClick={(e) => {
												setLockdown(true);

												addToCart(
													chunked[current][v]._id,
													1,
													e
												);
											}}
											className="item-hover-actions-btn cart hvr-shrink"
										>
											+ Ajouter au panier
										</button>

										<button
											disabled={lockdown}
											onClick={(e) => {
												setLockdown(true);
												handleBuy(
													chunked[current][v]._id,
													1,
													e
												);
											}}
											className="item-hover-actions-btn now"
										>
											Acheter ({chunked[current][v].price}
											€)
										</button>
									</motion.span>

									<span className="item-title">
										{chunked[current][v].name}
									</span>

									<div
										className={
											chunked[current][v].promotion > 0
												? "item-price-container item-price-promo"
												: "item-price-container"
										}
									>
										<span
											className={
												chunked[current][v].promotion >
												0
													? "item-price-w-promo"
													: "item-price"
											}
										>
											{chunked[current][v].price}€ (TTC)
										</span>

										{chunked[current][v].promotion > 0 ? (
											<span className="item-promotion-container">
												<span className="item-new-price">
													&nbsp;
													{(
														chunked[current][v]
															.price -
														(chunked[current][v]
															.price *
															chunked[current][v]
																.promotion) /
															100
													).toFixed(2)}
													€
												</span>

												<span className="item-promotion">
													{
														chunked[current][v]
															.promotion
													}
													%
												</span>
											</span>
										) : null}
									</div>
									<StarsLine
										rate={3}
										limit={5}
										count_feedback={0}
									/>
								</div>
							</motion.div>
						))
					) : (
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
									"#fdeb79",
									"#ff885e",
									"#fdeb79",
									"#ff885e",
									"#fdeb79",
									"#ff885e",
								]}
							/>
						</div>
					)}
				</div>

				<div className="shop-navigation">
					<button
						disabled={lockdown}
						className="before hvr-shrink btn"
						onClick={() => {
							setLockdown(true);
							handleBefore();
						}}
					>
						&lt;
					</button>

					<button
						disabled={lockdown}
						className="after hvr-shrink btn"
						onClick={() => {
							setLockdown(true);
							handleAfter();
						}}
					>
						&gt;
					</button>
				</div>
			</div>
		</Layout>
	);
}
