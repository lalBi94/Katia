import { Link } from "react-router-dom";
import "./NavBar.scss";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "hover.css";

export default function NavBar() {
	const [isLogged, setIsLogged] = useState(false);
	const [inBurger, setInBurger] = useState(false);

	useEffect(() => {
		setIsLogged(localStorage.getItem("katiacm") ? true : false);
	}, []);

	const handleInBuger = () => {
		setInBurger(!inBurger);
	};

	const goToHome = () => {
		window.location.href = "/home";
	};

	const revokeToken = () => {
		localStorage.removeItem("katiacm");
		goToHome();
	};

	const [links, _] = useState({
		logo: (
			<li className="nav-element">
				<img
					className="nav-link img hvr-wobble-bottom"
					src={logo}
					alt="Logo des delices de katia"
					onClick={goToHome}
				/>
			</li>
		),

		home: (
			<li className="nav-element resp">
				<Link className="nav-link hvr-wobble-bottom" to="/home">
					Accueil
				</Link>
			</li>
		),

		shop: (
			<li className="nav-element resp">
				<Link className="nav-link hvr-wobble-bottom" to="/shop">
					Boutique
				</Link>
			</li>
		),

		gate: (
			<li className="nav-element resp">
				<Link className="nav-link hvr-wobble-bottom" to="/gate">
					Portail
				</Link>
			</li>
		),

		instance_client: (
			<div className="nav-customer-instance-container resp">
				<li className="nav-element nav-element-customer-instance">
					<Link
						className="hvr-wobble-bottom nav-link nav-link-customer-instance"
						to="/customer"
					>
						Espace Client
					</Link>
				</li>

				<li className="nav-element nav-element-customer-instance resp">
					<button
						className="hvr-buzz-out nav-link-customer-instance btn"
						onClick={revokeToken}
					>
						Deconnexion
					</button>
				</li>
			</div>
		),

		burger: (
			<li id="burger" onClick={handleInBuger}>
				☰
			</li>
		),
	});

	return (
		<nav id="nav-container">
			<ul id="nav-elements-container">
				{links.logo}
				{links.home}
				{links.shop}

				{!isLogged ? links.gate : links.instance_client}

				{links.burger}
			</ul>

			{inBurger ? (
				<div id="burger-container">
					<span id="burger-close" onClick={handleInBuger}>
						×
					</span>

					{links.home}
					{links.shop}

					{!isLogged ? links.gate : links.instance_client}
				</div>
			) : null}
		</nav>
	);
}
