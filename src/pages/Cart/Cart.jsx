import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { cipherRequest } from "../../services/KTSec/KTSec";
import Admin from '../Customer/Categories/Admin/Admin';

export default function Cart() {
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0)
	const [tva, _] = useState(20)

	useEffect(() => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
		});
		cipherRequest(
			toSend,
			"https://katia-api.osc-fr1.scalingo.io/order/getOrdersOf"
		).then((res) => {
			console.log(res.data, res.status);
			switch (res.status) {
				case 0: {
					setData(res.data);

					let n = 0.0

					for(let i = 0; i <= res.data.length-1; ++i) {
						n += parseFloat(res.data[i].price) * parseInt(res.data[i].qte)
					}

					setTotal(n.toFixed(2))

					break;
				}

				case 1: {
					break;
				}
			}
		});
	}, []);

	// TODO: Stylisé + opti si possible

	return (
		<Layout>
			{data.length > 0
				? Object.keys(data).map(
					(v, k) => (
						<div key={k}>
							<span>{data[v].name}</span>&nbsp;&nbsp;&nbsp;
							<span>x{data[v].qte}</span>&nbsp;&nbsp;&nbsp;
							<span>{data[v].price*data[v].qte}€</span>&nbsp;&nbsp;&nbsp;
							<span>({data[v].price}€/u)</span>&nbsp;&nbsp;&nbsp;
						</div>
					))
			: <div>Pas de produit dans l'article</div>}

			<div>
				<span>Total: {total}€</span>
			</div>
		</Layout>
	);
}
