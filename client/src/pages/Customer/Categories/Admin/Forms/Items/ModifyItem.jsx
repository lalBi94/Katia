import { useState, useEffect } from "react";
import axios from "axios";

export default function ModifyItem({ handleClose }) {
	const [showedItems, setShowedItems] = useState([]);
	const [items, setItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState({});
	const [modifyName, setModifyName] = useState("");
	const [modifyPrice, setModifyPrice] = useState("");
	const [modifyPromotion, setModifyPromotion] = useState("");
	const [modifyImgRef, setModifyImgRef] = useState("");
	//const [status, setStatus] = useState(null);

	const handleModifyName = (e) => {
		setModifyName(e.target.value);
	};

	const handleModifyImgRef = (e) => {
		setModifyImgRef(e.target.value);
	};

	const handleModifyPrice = (e) => {
		setModifyPrice(e.target.value);
	};

	const handleModifyPromotion = (e) => {
		setModifyPromotion(e.target.value);
	};

	useEffect(() => {
		axios.post("http://localhost:3001/item/getAllItems").then((res) => {
			setItems(res.data);
			setShowedItems(res.data);
		});
	}, []);

	const handleSelect = (item) => {
		if (JSON.stringify(item) === JSON.stringify(selectedItem)) {
			setSelectedItem({});
		} else {
			setSelectedItem(item);
		}
	};

	return (
		<div className="popup-container">
			<span className="popup-title">Modifier un articles</span>

			<div className="popup-list-w-actions">
				{showedItems.length > 0
					? Object.keys(showedItems).map((v, k) => (
							<div
								className="popup-list-data"
								key={k}
								onClick={() => {
									handleSelect(showedItems[v]);
								}}
							>
								<img
									className="popup-list-data-img"
									src={showedItems[v].imgRef}
									alt=""
								/>
								<span className="popup-list-data-name">
									{showedItems[v].name} ({items[v].price}€)
								</span>
							</div>
					  ))
					: null}
			</div>

			{selectedItem._id ? (
				<div className="popup-modify">
					<img
						className="popup-modify-img"
						src={selectedItem.imgRef}
						alt=""
					/>
					<input
						onChange={handleModifyImgRef}
						type="number"
						className="popup-modify-url ipt"
						placeholder={`URL de l'image: ${selectedItem.imgRef}`}
					/>
					<input
						onChange={handleModifyName}
						type="text"
						className="popup-modify-title ipt"
						placeholder={`Nom: ${selectedItem.name}`}
					/>
					<input
						onChange={handleModifyPrice}
						type="number"
						className="popup-modify-price ipt"
						placeholder={`Prix: ${selectedItem.price}`}
					/>
					<input
						onChange={handleModifyPromotion}
						type="number"
						className="popup-modify-promotion ipt"
						placeholder={`Promotion: ${selectedItem.promotion}`}
					/>
				</div>
			) : null}

			<div className="popup-btn-container">
				<button className="btn hvr-shrink" onClick={null}>
					Modifier
				</button>
				<button className="btn hvr-shrink" onClick={handleClose}>
					Quitter
				</button>
			</div>
		</div>
	);
}
