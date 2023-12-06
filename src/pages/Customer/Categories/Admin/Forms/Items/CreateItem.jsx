import { useState, useRef } from "react";
import "../popup.scss";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import "hover.css";
import config from "../../../../../../global.json";
import axios from "axios";

/**
 * [ADMIN FEATURES] Creer un produit
 * @param {{handleClose: <void>}} param0 Fonction qui fermera ce formulaire
 * @return {HTMLElement}
 */
export default function CreateItem({ handleClose }) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [promotion, setPromotion] = useState("");
	const [imgRef, setImgRef] = useState(null);
	const [status, setStatus] = useState(null);
	const [category, setCategory] = useState("");

	const [refs, _] = useState({
		name: useRef(null),
		price: useRef(null),
		promotion: useRef(null),
		imgRef: useRef(null),
		category: useRef(null),
	});

	/**
	 * Nom du produit
	 * @param {Event} e
	 */
	const handleName = (e) => {
		setStatus(null);
		setName(e.target.value);
	};

	/**
	 * Prix du produit
	 * @param {Event} e
	 */
	const handlePrice = (e) => {
		setStatus(null);
		setPrice(e.target.value);
	};

	/**
	 * Categorie du produit
	 * @param {Event} e
	 */
	const handleCategory = (e) => {
		setStatus(null);
		setCategory(e.target.value);
	};

	/**
	 * Promotion du produit
	 * @param {Event} e
	 */
	const handlePromotion = (e) => {
		setStatus(null);
		setPromotion(e.target.value);
	};

	/**
	 * Url de l'image du produit
	 * @param {Event} e
	 */
	const handleImgRef = (e) => {
		e.preventDefault();
		setStatus(null);

		const image = e.target.files[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			const fileExtension = image.name.split(".").pop();
			if (
				!["jpg", "jpeg", "png", "gif", "tiff"].includes(fileExtension)
			) {
				setStatus(4);
				return;
			}

			console.log(fileExtension);

			setImgRef(reader.result);
		};

		if (image) {
			reader.readAsDataURL(image);
		} else {
		}
	};

	/**
	 * Creer le produit
	 * @return {void}
	 */
	const handleCreateItem = () => {
		if (!name || !price || !promotion || !imgRef) {
			setStatus(3);
			return;
		}

		const formData = new FormData();
		formData.append("imgRef", imgRef.split(",")[1]);
		formData.append("token", localStorage.getItem("katiacm"));
		formData.append("name", name);
		formData.append("price", price);
		formData.append("promotion", promotion);
		formData.append("category", category);

		axios.post(`${config.api}/item/setItem`, formData).then((res) => {
			setStatus(res.data.status);
			setImgRef(null);
		});
	};

	/**
	 * Vider les champs
	 * @return {void}
	 */
	const handleClear = () => {
		for (const e in refs) {
			refs[e].current.value = "";
		}
	};

	return (
		<div className="popup-container">
			<span className="popup-title">Création de Produit</span>

			{status === 1 ? (
				<p className="error">Une erreur est survenue !</p>
			) : null}

			{status === 2 ? (
				<p className="error">Ce Produit existe deja !</p>
			) : null}

			{status === 3 ? (
				<p className="error">Remplissez tous les champs !</p>
			) : null}

			{status === 4 ? (
				<p className="error">Format de l'image non pris en charge !</p>
			) : null}

			{status === 0 ? (
				<p className="succes">Le Produit a été crée !</p>
			) : null}

			{imgRef ? <img className="preview" src={imgRef} alt="" /> : null}

			<input
				ref={refs.name}
				onChange={handleName}
				className="ipt"
				type="text"
				placeholder="Nom"
			/>
			<input
				ref={refs.price}
				onChange={handlePrice}
				className="ipt"
				min={0}
				type="number"
				placeholder="Prix"
			/>
			<input
				ref={refs.promotion}
				onChange={handlePromotion}
				className="ipt"
				type="number"
				placeholder="Promo (0 si non)"
				min={0}
				max={100}
			/>

			<input
				ref={refs.imgRef}
				onChange={handleImgRef}
				type="file"
				accept="image/*"
				placeholder="Url de l'image"
			/>

			<div className="popup-custom-2-entity">
				<span className="text">Catégorie</span>

				<select ref={refs.category} onChange={handleCategory}>
					<option value="Entrée">Entrée</option>
					<option value="Plat">Plat</option>
					<option value="Desert">Desert</option>
					<option value="Autres">Autres</option>
				</select>
			</div>

			<div className="popup-btn-container">
				<button className="btn hvr-shrink" onClick={handleCreateItem}>
					Creer
				</button>
				<button className="btn hvr-shrink" onClick={handleClose}>
					Quitter
				</button>
				<button className="btn hvr-shrink" onClick={handleClear}>
					Vider
				</button>
			</div>
		</div>
	);
}
