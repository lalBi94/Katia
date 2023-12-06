import { useEffect, useState } from "react";
import "./StarsLine.scss";

/**
 * @param {{rate: number, limit: number, count_feedback: number}} param0 Le nombre d'etoile
 */
export default function StarsLine({ rate, limit, count_feedback }) {
	const [starIcon, setStarIcon] = useState("★");
	const [starsList, setStarsList] = useState([]);

	useEffect(() => {
		const stock = [];

		for (let i = 0; i <= limit - 1; ++i) {
			stock.push(
				<span
					key={i}
					className={`stars ${
						i < rate ? "complete-star" : "not-complete-star"
					}`}
				>
					{starIcon}
				</span>
			);
		}

		setStarsList(stock);
	}, []);

	return <div className="stars-line-container">{starsList || null}</div>;
}
