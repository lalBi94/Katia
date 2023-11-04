import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import "./Customer.scss";
import MyAccount from "./Categories/MyAccount/MyAccount";
import { cipherRequest } from "../../services/KTSec/KTSec";
import Admin from "./Categories/Admin/Admin";

export default function Customer() {
	const [userData, setUserData] = useState({});
	const [selectedComponent, setSelectedComponent] = useState(null);

	const handleMyAccount = (data) => {
		setSelectedComponent(<MyAccount data={data} />);
	};

	const handleReservations = () => {
		setSelectedComponent(null);
	};

	const handleHistory = () => {
		setSelectedComponent(null);
	};

	const handleAdmin = () => {
		setSelectedComponent(<Admin />);
	};

	useEffect(() => {
		const token = localStorage.getItem("katiacm");

		if (!token) {
			window.location.href = "/home";
		}

		cipherRequest(token, "https://katia-api.osc-fr1.scalingo.io/customer/getInfo").then(
			(res) => {
				switch (res.status) {
					case 0: {
						setUserData(res.data);
						handleMyAccount(res.data);
						break;
					}

					case 1: {
						break;
					}
				}
			}
		);
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
								Mon historique d'achats
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
			) : null}
		</Layout>
	);
}
