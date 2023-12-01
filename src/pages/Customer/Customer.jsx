import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import "./Customer.scss";
import MyAccount from "./Categories/MyAccount/MyAccount";
import { cipherRequest } from "../../services/KTSec/KTSec";
import Admin from "./Categories/Admin/Admin";
import { Puff } from "react-loader-spinner";
import config from "../../global.json"

/**
 * Page cliente
 * @return {HTMLElement}
 */
export default function Customer() {
	const [userData, setUserData] = useState({});
	const [selectedComponent, setSelectedComponent] = useState(null);

	/**
	 * Renvoyer la page de la modification cliente
	 * @param {{}} data Informations du client
	 * @return {void}
	 */
	const handleMyAccount = (data) => {
		setSelectedComponent(<MyAccount data={data} />);
	};

	/**
	 * Ouvrir le panel d'administration
	 * @return {void}
	 */
	const handleAdmin = () => {
		setSelectedComponent(<Admin />);
	};

	/**
	 * Ouvrir la liste des reservations en cours
	 * @return {void}
	 */
	const handleReservations = () => {
		setSelectedComponent(null);
	};

	/**
	 * Ouvrir la liste des reservations passe en cours
	 * @return {void}
	 */
	const handleHistory = () => {
		setSelectedComponent(null);
	};

	useEffect(() => {
		if(!localStorage.getItem("katiacm")) window.location.href = "/Katia/#/gate";

		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm") 
		})

		cipherRequest(
			toSend,
			`${config.api}/customer/getInfo`
		).then((res) => {
			if(!res.data) {
				localStorage.removeItem("katiacm")
				window.location.href = "/Katia/#/gate";
			}

			if(res.status === 0 && res.data) {
				setUserData(res.data);
				handleMyAccount(res.data);
			}
		});
	}, []);

	return (
		<Layout>
			{userData ? (
				<div id="customer-container">
					<div id="customer-header">
						<h2 id="customer-title">
							Heureux de vous voir {userData.firstname} !
						</h2>
						<h4 id="customer-subtitle">
							Sur cette page, trouvez toutes les infos de votre
							compte client
						</h4>
					</div>

					<div id="customer-informations-container">
						<div id="customer-category-container">
							<div
								className="customer-category-link"
								onClick={() => {
									handleMyAccount(userData);
								}}
							>
								Mon compte
							</div>

							<div className="customer-category-link">
								Mes reservations
							</div>

							<div className="customer-category-link">
								Mon historique
							</div>

							{userData.type === "admin" ? (
								<div
									className="customer-category-link"
									onClick={handleAdmin}
								>
									Admin Panel
								</div>
							) : null}
						</div>
					</div>

					<div id="customer-information">{selectedComponent}</div>
				</div>
			) : (
				<div class="loader">
					<Puff
						height="80"
						width="80"
						radius={1}
						color="#cb4a4a"
						ariaLabel="puff-loading"
						wrapperStyle={{}}
						wrapperClass=""
						visible={true}
					/>
				</div>
			)
			}
		</Layout>
	);
}
