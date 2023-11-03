import "./Admin.scss";
import { useState } from "react";
import CreateItem from "./Forms/Items/CreateItem";

export default function Admin() {
	const [form, setForm] = useState(null);

	const handleCloseForm = () => {
		setForm(null);
	};

	const handleForm = (what) => {
		switch (what) {
			case "create_item": {
				setForm(<CreateItem handleClose={handleCloseForm} />);
				break;
			}
		}
	};

	return (
		<div id="admin-container">
			{form ? <div id="admin-form-popup">{form}</div> : null}

			<div className="admin-category">
				<h3 className="admin-category-title">Articles</h3>

				<div className="admin-category-btns">
					<button
						onClick={() => {
							handleForm("create_item");
						}}
						className="admin-category-btn"
					>
						Créer un article
					</button>
					<button className="admin-category-btn">
						Supprimer un article
					</button>
					<button className="admin-category-btn">
						Modifier un article
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
