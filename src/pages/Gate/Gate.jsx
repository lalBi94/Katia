import { useEffect, useState } from "react";
import { SHA512 } from "crypto-js";
import "./Gate.scss";
import Layout from "../../Layout/Layout";
import { cipherRequest } from "../../services/KTSec/KTSec";

/**
 * Portal de connexion/inscription
 * @return {HTMLElement}
 */
export default function Gate() {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);
	const [lockDown, setLockDown] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("katiacm"))
			window.location.href = "/Katia/#/customer";
	}, []);

	/**
	 * Nom de famille du futur client
	 * @param {Event} e 
	 */
	const handleFirstname = (e) => {
		setFirstname(e.target.value);
	};

	/**
	 * Prenom du futur client
	 * @param {Event} e 
	 */
	const handleLastname = (e) => {
		setLastname(e.target.value);
	};

	/**
	 * Email du futur client
	 * @param {Event} e 
	 */
	const handleEmail = (e) => {
		setEmail(e.target.value);
	};

	/**
	 * Mot de passe du futur client
	 * @param {Event} e 
	 */
	const handlePassword = (e) => {
		setPassword(e.target.value);
	};

	/**
	 * Switch -> Login
	 */
	const handleLogin = () => {
		setIsLogin(true);
	};

	/**
	 * Switch -> Register
	 */
	const handleRegister = () => {
		setIsLogin(false);
	};

	/**
	 * Envoyer le forumlaire d'inscription
	 * @return {void}
	 */
	const handleRegisterSubmit = () => {
		setLockDown(true);

		if (
			firstname.length > 0 &&
			lastname.length > 0 &&
			password.length > 0
		) {
			const hash = SHA512(password).toString();
			const toSend = JSON.stringify({
				firstname: firstname,
				lastname: lastname,
				email: email,
				password: hash,
			});

			cipherRequest(
				toSend,
				"https://katia-api.osc-fr1.scalingo.io/customer/register"
			).then((data) => {
				switch (data.status) {
					case 0: {
						localStorage.setItem("katiacm", data.token);
						window.location.href = "/Katia/#/customer";
						break;
					}

					case 1: {
						break;
					}

					case 2: {
						break;
					}
				}

				setLockDown(false);
			});
		}
	};

	/**
	 * Envoyer le forumlaire de connexion
	 * @return {void}
	 */
	const handleLoginSubmit = () => {
		setLockDown(true);

		if (email.length > 0 && password.length > 0) {
			const hash = SHA512(password).toString();
			const toSend = JSON.stringify({ email: email, password: hash });

			cipherRequest(
				toSend,
				"https://katia-api.osc-fr1.scalingo.io/customer/login"
			).then((token) => {
				if (token) {
					localStorage.setItem("katiacm", token);
					window.location.href = "/Katia/#/customer"
				}

				setLockDown(false);
			});
		}
	};

	return (
		<Layout>
			<div id="gate-container">
				<div id="selector">
					<button className="selector-btn" onClick={handleLogin}>
						Connexion
					</button>
					<button className="selector-btn" onClick={handleRegister}>
						Inscription
					</button>
				</div>

				{isLogin ? (
					<div id="login-container">
						<h3>Connexion</h3>
						<input
							className="login-input ipt"
							type="text"
							placeholder="E-mail"
							onChange={handleEmail}
							disabled={lockDown}
						/>
						<input
							className="login-input ipt"
							type="password"
							placeholder="Mot de passe"
							onChange={handlePassword}
							disabled={lockDown}
						/>
						<button
							className="login-btn btn"
							onClick={handleLoginSubmit}
							disabled={lockDown}
						>
							Se connecter
						</button>
					</div>
				) : (
					<div id="register-container">
						<h3>Inscription</h3>
						<input
							className="register-input ipt"
							type="text"
							placeholder="Prenom"
							onChange={handleFirstname}
							disabled={lockDown}
						/>
						<input
							className="register-input ipt"
							type="text"
							placeholder="Nom"
							onChange={handleLastname}
							disabled={lockDown}
						/>
						<input
							className="register-input ipt"
							type="email"
							placeholder="E-mail"
							onChange={handleEmail}
							disabled={lockDown}
						/>
						<input
							className="register-input ipt"
							type="password"
							placeholder="Mot de passe"
							onChange={handlePassword}
							disabled={lockDown}
						/>
						<button
							className="register-btn btn"
							onClick={handleRegisterSubmit}
						>
							S'inscrire
						</button>
					</div>
				)}
			</div>
		</Layout>
	);
}
