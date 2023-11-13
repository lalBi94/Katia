import "./Admin.scss";
import { useState } from "react";
import CreateItem from "./Forms/Items/CreateItem";
import DeleteItem from "./Forms/Items/DeleteItem";
import ModifyItem from "./Forms/Items/ModifyItem";

/**
 * [ADMIN FEATURES] Administration du site
 * @return {HTMLElement}
 */
export default function Admin() {
	const [form, setForm] = useState(null);

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
			}
		}
	};

	return (
		<div id="admin-container">
			{form ? <div id="admin-form-popup">{form}</div> : null}

			<div className="admin-category">
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
					<button className="admin-category-btn">
						Voir les reservations
					</button>
					<button className="admin-category-btn">
						Voir l'historique d'achat
					</button>
					<button className="admin-category-btn">
						Créer un client
					</button>
					<button className="admin-category-btn">
						Supprimer un client
					</button>
					<button className="admin-category-btn">
						Modifier un client
					</button>
					<button className="admin-category-btn">
						Modifier les permissions d'un client
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
