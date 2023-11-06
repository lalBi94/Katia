import { Link } from "react-router-dom";
import "./NavBar.scss";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "hover.css";
import { cipherRequest } from "../../services/KTSec/KTSec";

export default function NavBar() {
	const [isLogged, setIsLogged] = useState(false);
	const [inBurger, setInBurger] = useState(false);
	const [inCart, setInCart] = useState(null)

	useEffect(() => {
		setIsLogged(localStorage.getItem("katiacm") ? true : false);
		
		if(!localStorage.getItem("c_len")) {
			localStorage.setItem("c_len", 0)	
		} else {
			setInCart(localStorage.getItem("c_len"))
		}

		const toSend = JSON.stringify({token: localStorage.getItem("katiacm")})

		cipherRequest(toSend, "https://katia-api.osc-fr1.scalingo.io/order/getOrdersOf").then((res) => {
			localStorage.setItem("c_len", res.data.length)
			setInCart(localStorage.getItem("c_len"))
		})
	}, []);

	const handleInBuger = () => {
		setInBurger(!inBurger);
	};

	const goToHome = () => {
		window.location.href = "/Katia/home";
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
					alt="Logo des delices de Katia"
					onClick={goToHome}
				/>
			</li>
		),

		home: (
			<li className="nav-element resp">
				<Link className="nav-link hvr-wobble-bottom" to="/Katia/home">
					Accueil
				</Link>
			</li>
		),

		shop: (
			<li className="nav-element resp">
				<Link className="nav-link hvr-wobble-bottom" to="/Katia/shop">
					Boutique
				</Link>
			</li>
		),

		gate: (
			<li className="nav-element resp">
				<Link className="nav-link hvr-wobble-bottom" to="/Katia/gate">
					Portail
				</Link>
			</li>
		),

		instance_client: (
			<div className="nav-customer-instance-container resp">
				<li className="nav-element nav-element-customer-instance">
					<Link
						className="hvr-wobble-bottom nav-link nav-link-customer-instance"
						to="/Katia/customer"
					>
						Espace Client
					</Link>
				</li>

				<li className="nav-element nav-element-customer-instance resp">
					<button
						className="hvr-buzz-out nav-link-customer-instance btn-deco btn"
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
				{isLogged ? 
					<div className="nav-element resp">
						<Link
							className="nav-link hvr-wobble-bottom"
							to="/Katia/cart"
						>
							Panier <span className="nav-element-cart-len">{inCart}</span>
						</Link> 
					</div>
				: null}
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
					{isLogged ? 
						<li className="nav-element resp">
							<Link
								className="nav-link spe hvr-wobble-bottom"
								to="/Katia/cart"
							>
								Panier <span className="nav-element-cart-len">{inCart}</span>
							</Link> 
						</li>
					: null}

					{!isLogged ? links.gate : links.instance_client}
				</div>
			) : null}
		</nav>
	);
}
