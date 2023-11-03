import "./Shop.scss";
import Layout from "../../Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import "hover.css";

export default function Shop() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		axios.post("http://localhost:3001/item/getAllItems").then((res) => {
			setItems(res.data);
		});
	}, []);

	return (
		<Layout>
			<div id="shop-container">
				{items.length > 0
					? Object.keys(items).map((v, k) => (
							<div className="item-container hvr-shrink" key={k}>
								<img
									className="item-imgRef"
									src={items[v].imgRef}
									alt=""
								/>

								<span className="item-title">
									{items[v].name}
								</span>

								<span className="item-price">
									{items[v].price}€
								</span>

								<span className="item-promotion">
									{items[v].promo > 0
										? `${items[v].promotion}%`
										: null}
								</span>
							</div>
					  ))
					: "tg"}
			</div>
		</Layout>
	);
}
