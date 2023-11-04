import "./Shop.scss";
import Layout from "../../Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import "hover.css";
import { motion } from "framer-motion";

export default function Shop() {
	const [chunked, setChunked] = useState([[]]);
	const [current, setCurrent] = useState(0);

	const chunks = (r, j) =>
		r.reduce(
			(a, b, i, g) => (!(i % j) ? a.concat([g.slice(i, i + j)]) : a),
			[]
		);

	const handleAfter = () => {
		setCurrent(current === chunked.length - 1 ? current : current + 1);
	};

	const handleBefore = () => {
		setCurrent(current === 0 ? current : current - 1);
	};

	useEffect(() => {
		axios
			.post("https://katia-api.osc-fr1.scalingo.io/item/getAllItems")
			.then((res) => {
				const newRes = chunks(res.data, 8);
				setChunked(newRes);
			});
	}, []);

	return (
		<Layout>
			<div id="shop-container">
				<div className="shop-navigation">
					<button
						className="before hvr-shrink"
						onClick={handleBefore}
					>
						Precedent
					</button>
					<button className="after hvr-shrink" onClick={handleAfter}>
						Suivant
					</button>
				</div>

				<div id="shop-data-container">
					{chunked[current].length > 0
						? Object.keys(chunked[current]).map((v, k) => (
								<motion.div
									initial={{ opacity: 0.5 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									duration={1500}
									key={k}
								>
									<div className="item-container hvr-shrink">
										<img
											className="item-imgRef"
											src={chunked[current][v].imgRef}
											alt=""
										/>

										<span className="item-title">
											{chunked[current][v].name}
										</span>

										<div
											className={
												chunked[current][v].promotion >
												0
													? "item-price-container item-price-promo"
													: "item-price-container"
											}
										>
											<span
												className={
													chunked[current][v]
														.promotion > 0
														? "item-price-w-promo"
														: "item-price"
												}
											>
												{chunked[current][v].price}€
												&nbsp;
											</span>

											{chunked[current][v].promotion >
											0 ? (
												<span className="item-promotion-container">
													<span className="item-new-price">
														&nbsp;
														{(
															chunked[current][v]
																.price -
															(chunked[current][v]
																.price *
																chunked[
																	current
																][v]
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
									</div>
								</motion.div>
						  ))
						: null}
				</div>

				<div className="shop-navigation">
					<button
						className="before hvr-shrink"
						onClick={handleBefore}
					>
						Precedent
					</button>
					<button className="after hvr-shrink" onClick={handleAfter}>
						Suivant
					</button>
				</div>
			</div>
		</Layout>
	);
}
