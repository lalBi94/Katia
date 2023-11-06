import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { cipherRequest } from "../../services/KTSec/KTSec";
import "./Cart.scss";

export default function Cart() {
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [tva, _] = useState(20);

	useEffect(() => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
		});
		cipherRequest(
			toSend,
			"https://katia-api.osc-fr1.scalingo.io/order/getOrdersOf"
		).then((res) => {
			switch (res.status) {
				case 0: {
					setData(res.data);

					let n = 0.0;

					for (let i = 0; i <= res.data.length - 1; ++i) {
						n +=
							parseFloat(res.data[i].price) *
							parseInt(res.data[i].qte);
						console.log(
							`${parseFloat(res.data[i].price)}*${parseInt(
								res.data[i].qte
							)}=${n}`
						);
					}

					setTotal(n.toFixed(2));

					break;
				}

				case 1: {
					setData(null);
					break;
				}
			}
		});
	}, []);

	return (
		<Layout>
			{data.length > 0 ? (
				<div id="cart-container">
					<table id="cart-items-container">
						<thead id="cart-item-thead">
							<th className="cart-items-titles">
								Nom du produit
							</th>
							<th className="cart-items-titles">Quantité</th>
							<th className="cart-items-titles">Prix</th>
							<th className="cart-items-titles">Actions</th>
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
										<button className="cart-item-btn btn">
											-
										</button>
										<button className="cart-item-btn btn">
											+
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div id="cart-total-container">
						<div id="cart-total-btns">
							<button className="cart-total-btn btn">
								Acheter ({total}€)
							</button>
							<button className="cart-total-btn btn">
								Retourner à la boutique
							</button>
							<button className="cart-total-btn btn">
								Vider le panier
							</button>
						</div>
					</div>
				</div>
			) : (
				<div>Vous n'avez rien dans votre panier</div>
			)}
		</Layout>
	);
}
