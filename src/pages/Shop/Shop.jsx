import "./Shop.scss";
import Layout from "../../Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import "hover.css";
import { Puff } from "react-loader-spinner";
import { motion } from "framer-motion";
import { cipherRequest } from "../../services/KTSec/KTSec";

/**
 * Page de la boutique
 * @return {HTMLElement}
 */
export default function Shop() {
	const [chunked, setChunked] = useState([[]]);
	const [current, setCurrent] = useState(0);
	const [clientId, setClientId] = useState(null);
	const [lockdown, setLockdown] = useState(false);

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

	/**
	 * Ajouter un produit au panier
	 * @param {*} itemId Identifiant du produit
	 * @param {*} qte Quantite du produit
	 * @param {HTMLElement} element Tag du bouton selectionne
	 * @return {void}
	 */
	const addToCart = (itemId, qte, element) => {
		const e = element.target;
		e.style.background = "#349734";
		e.innerText = "Ajouté au panier !";

		setTimeout(() => {
			e.style.background = "#cb4a4a";
			e.innerText = "+ Ajouter au panier";
		}, 800);

		if (!clientId) {
			window.location.href = "/Katia/gate";
		} else {
			const toSend = JSON.stringify({
				token_c: localStorage.getItem("katiacm"),
				itemId: itemId,
				qte: qte,
			});

			cipherRequest(
				toSend,
				"https://katia-api.osc-fr1.scalingo.io/order/addToCart"
			).then((res) => {
				console.log(res);
				setLockdown(false);
			});
		}
	};

	useEffect(() => {
		axios
			.post("https://katia-api.osc-fr1.scalingo.io/item/getAllItems")
			.then((res) => {
				const newRes = chunks(res.data, 8);
				setChunked(newRes);
			});

		if (localStorage.getItem("katiacm")) {
			cipherRequest(
				localStorage.getItem("katiacm"),
				"https://katia-api.osc-fr1.scalingo.io/customer/getUserId"
			).then((res) => {
				setClientId(res);
			});
		}
	}, []);

	return (
		<Layout>
			<div id="shop-container">
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

									<span className="item-hover-actions">
										<div className="item-hover-actions-blur"></div>
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
											className="item-hover-actions-items btn"
										>
											+ Ajouter au panier
										</button>

										<button
											disabled={lockdown}
											onClick={() => {
												setLockdown(false);
											}}
											className="item-hover-actions-items btn"
										>
											Acheter
										</button>
									</span>

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
											{chunked[current][v].price}€ (HT)
											&nbsp;
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
													€ (HT)
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
								</div>
							</motion.div>
						))
					) : (
						<div className="loader">
							<Puff
								height="80"
								width="80"
								radius={1}
								color="#cb4a4a"
								ariaLabel="puff-loading"
								wrapperStyle={{}}
								wrapperClass=""
								visible={true}
							/>
						</div>
					)}
				</div>

				<div className="shop-navigation">
					<button
						disabled={lockdown}
						className="before"
						onClick={() => {
							setLockdown(true);
							handleBefore();
						}}
					>
						Precedent
					</button>

					<button
						disabled={lockdown}
						className="after"
						onClick={() => {
							setLockdown(true);
							handleAfter();
						}}
					>
						Suivant
					</button>
				</div>
			</div>
		</Layout>
	);
}
