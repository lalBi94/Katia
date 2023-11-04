import { useEffect, useState } from "react";
import "../popup.scss";
import axios from "axios";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";

export default function DeleteItem({ handleClose }) {
	const [showedItems, setShowedItems] = useState([]);
	const [items, setItems] = useState([]);
	const [selectedItems, _] = useState([]);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		axios.post("https://katia-api.osc-fr1.scalingo.io/item/getAllItems").then((res) => {
			setItems(res.data);
			setShowedItems(res.data);
		});
	}, []);

	const handleSelect = (id) => {
		if (selectedItems.indexOf(id) >= 0) {
			selectedItems.splice(selectedItems.indexOf(id), 1);
		} else {
			selectedItems.push(id);
		}
	};

	const handleDelete = () => {
		if (selectedItems.length === 0) {
			return;
		}
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
			data: selectedItems,
		});

		cipherRequest(toSend, "http://127.0.0.1:3001/item/deleteItems").then(
			(res) => {
				setStatus(res.status);
			}
		);
	};

	return (
		<div className="popup-container">
			<span className="popup-title">Supprimer des articles</span>

			{status === 0 ? (
				<p className="succes">Articles supprimés avec succes !</p>
			) : null}

			{status === 1 ? (
				<p className="error">Une erreur est survenue !</p>
			) : null}

			<div className="popup-list-w-actions">
				{showedItems.length > 0
					? Object.keys(showedItems).map((v, k) => (
							<div className="popup-list-data" key={k}>
								<img
									className="popup-list-data-img"
									src={showedItems[v].imgRef}
									alt=""
								/>
								<span className="popup-list-data-name">
									{showedItems[v].name} ({items[v].price}€)
								</span>
								<input
									type="checkbox"
									onClick={() => {
										handleSelect(showedItems[v]._id);
									}}
								/>
							</div>
					  ))
					: null}
			</div>

			<div className="popup-btn-container">
				<button className="btn hvr-shrink" onClick={handleDelete}>
					Supprimer
				</button>
				<button className="btn hvr-shrink" onClick={handleClose}>
					Quitter
				</button>
			</div>
		</div>
	);
}
