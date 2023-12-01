import { useState, useRef } from "react";
import "../popup.scss";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import "hover.css";
import config from "../../../../../../global.json"

/**
 * [ADMIN FEATURES] Creer un produit
 * @param {{handleClose: <void>}} param0 Fonction qui fermera ce formulaire
 * @return {HTMLElement}
 */
export default function CreateItem({ handleClose }) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [promotion, setPromotion] = useState("");
	const [imgRef, setImgRef] = useState("");
	const [status, setStatus] = useState(null);
	const [refs, _] = useState({
		name: useRef(null),
		price: useRef(null),
		promotion: useRef(null),
		imgRef: useRef(null),
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
		setStatus(null);
		setImgRef(e.target.value);
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

		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
			name: name,
			price: price,
			promotion: promotion,
			imgRef: imgRef,
		});

		cipherRequest(toSend, `${config.api}/item/setItem`).then(
			(res) => {
				setStatus(res.status);
			}
		);
	};

	/**
	 * Vider les champs
	 * @return {void}
	 */
	const handleClear = () => {
		for (let e in refs) {
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

			{status === 0 ? (
				<p className="succes">Le Produit a été crée !</p>
			) : null}

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
				className="ipt"
				type="text"
				placeholder="Url de l'image"
			/>

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
