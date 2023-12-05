import "./Admin.scss";
import { useEffect, useState } from "react";
import CreateItem from "./Forms/Items/CreateItem";
import DeleteItem from "./Forms/Items/DeleteItem";
import ModifyItem from "./Forms/Items/ModifyItem";
import ShowReservation from "./Forms/Customers/ShowReservations";
import CheckCode from "./Forms/Caisse/CheckCode";
import { cipherRequest } from "../../../../services/KTSec/KTSec";
import config from "../../../../global.json";
import axios from "axios";
import "hover.css";

/**
 * [ADMIN FEATURES] Administration du site
 * @return {HTMLElement}
 */
export default function Admin() {
	const [form, setForm] = useState(null);
	const [solde, setSolde] = useState({ av: "██████", ca: "██████" });
	const [nbItems, setNbItems] = useState("██████");
	const [nbCustomer, setNbCustomer] = useState("██████");

	/**
	 * Ouvrir/Fermer le formulaire
	 * @return {void}
	 */
	const handleCloseForm = () => {
		setForm(null);
	};

	const handleGetStats = () => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
		});

		cipherRequest(toSend, `${config.api}/reservation/getSolde`).then(
			(res) => {
				setSolde({ av: res.av.toFixed(2), ca: res.ca.toFixed(2) });
			}
		);

		axios.post(`${config.api}/item/getItemsLength`).then((res) => {
			console.log(res.data.n);
			setNbItems(parseInt(res.data.n));
		});

		axios.post(`${config.api}/customer/getCustomersLength`).then((res) => {
			console.log(res.data.n);
			setNbCustomer(parseInt(res.data.n));
		});
	};

	/**
	 * Faire poper un formulaire
	 * @param {string} what
	 */
	const handleForm = (what) => {
		switch (what) {
			case "create_item": {
				setForm(<CreateItem handleClose={handleCloseForm} />);
				break;
			}

			case "delete_item": {
				setForm(<DeleteItem handleClose={handleCloseForm} />);
				break;
			}

			case "modify_item": {
				setForm(<ModifyItem handleClose={handleCloseForm} />);
				break;
			}

			case "show_reservation": {
				setForm(<ShowReservation handleClose={handleCloseForm} />);
				break;
			}

			case "check_code": {
				setForm(<CheckCode handleClose={handleCloseForm} />);
				break;
			}
		}

		window.scrollTo(0, 0)
	};

	useEffect(() => {
		handleGetStats();
	}, []);

	return (
		<div id="admin-container">
			{form ? <div id="admin-form-popup">{form}</div> : null}

			<div className="admin-category">
				<h3 className="admin-category-title">En Caisse</h3>
				<div className="admin-category-btns">
					<button
						onClick={() => {
							handleForm("check_code");
						}}
						className="admin-category-btn"
					>
						Entrer un code
					</button>
				</div>

				<h3 className="admin-category-title">
					Données utiles
					<button className="spe-btn btn" onClick={handleGetStats}>
						↺
					</button>
				</h3>

				<div id="admin-solde">
					<span id="admin-solde-CA">
						Recette <br /> <nobr>[ {solde.ca} € ]</nobr>
					</span>
					<span id="admin-solde-AV">
						A Venir <br /> <nobr>[ {solde.av} € ]</nobr>
					</span>
					<span id="admin-solde-O">
						Nombre d'inscrits <br /> <nobr>[ {nbCustomer} ]</nobr>
					</span>
					<span id="admin-solde-O">
						Nombre de produits <br /> <nobr>[ {nbItems} ]</nobr>
					</span>
				</div>

				<h3 className="admin-category-title">Produits</h3>
				<div className="admin-category-btns">
					<button
						onClick={() => {
							handleForm("create_item");
						}}
						className="admin-category-btn"
					>
						Créer un Produit
					</button>

					<button
						onClick={() => {
							handleForm("delete_item");
						}}
						className="admin-category-btn"
					>
						Supprimer des Produits
					</button>

					<button
						onClick={() => {
							handleForm("modify_item");
						}}
						className="admin-category-btn"
					>
						Modifier un Produit
					</button>
				</div>
			</div>

			<div className="admin-category">
				<h3 className="admin-category-title">Clients</h3>

				<div className="admin-category-btns">
					<button
						className="admin-category-btn"
						onClick={() => {
							handleForm("show_reservation");
						}}
					>
						Voir les reservations
					</button>
				</div>
			</div>

			<div className="admin-category">
				<h3 className="admin-category-title">Support</h3>

				<div className="admin-category-btns">
					<button className="admin-category-btn">
						Voir les tickets
					</button>
					<button className="admin-category-btn">
						Modifier les coordonnees
					</button>
				</div>
			</div>
		</div>
	);
}
