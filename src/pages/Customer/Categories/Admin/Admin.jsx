import "./Admin.scss";
import { useEffect, useState } from "react";
import CreateItem from "./Forms/Items/CreateItem";
import DeleteItem from "./Forms/Items/DeleteItem";
import ModifyItem from "./Forms/Items/ModifyItem";
import ShowReservation from "./Forms/Customers/ShowReservations";
import CheckCode from "./Forms/Caisse/CheckCode";
import { cipherRequest } from "../../../../services/KTSec/KTSec";
import config from "../../../../global.json"

/**
 * [ADMIN FEATURES] Administration du site
 * @return {HTMLElement}
 */
export default function Admin() {
	const [form, setForm] = useState(null);
	const [solde, setSolde] = useState({av: "██████", ca: "██████"})

	/**
	 * Ouvrir/Fermer le formulaire
	 * @return {void}
	 */
	const handleCloseForm = () => {
		setForm(null);
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
				setForm(<ShowReservation handleClose={handleCloseForm} />)
				break;
			}

			case "check_code": {
				setForm(<CheckCode handleClose={handleCloseForm}/>)
				break;
			}
		}
	};

	useEffect(() => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm")
		})

		cipherRequest(toSend, `${config.api}/reservation/getSolde`).then((res) => {
			setSolde({av: (res.av).toFixed(2), ca: (res.ca).toFixed(2)})
		})
	}, [])

	return (
		<div id="admin-container">
			{form ? <div id="admin-form-popup">{form}</div> : null}

			<div id="admin-solde">
				<span id="admin-solde-CA">C.A Du site: {solde.ca} €</span>
				<span id="admin-solde-AV">A Venir: {solde.av} €</span>
			</div>

			<div className="admin-category">
				<h3 className="admin-category-title">Caisse</h3>
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
					<button className="admin-category-btn" onClick={() => {
						handleForm("show_reservation");
					}}>
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
