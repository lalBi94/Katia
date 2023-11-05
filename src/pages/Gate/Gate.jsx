import { useState } from "react";
import axios from "axios";
import { SHA512 } from "crypto-js";
import "./Gate.scss";
import Layout from "../../Layout/Layout";
import { cipherRequest } from "../../services/KTSec/KTSec";

export default function Gate() {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);
	const [lockDown, setLockDown] = useState(false);
	const [status, setStatus] = useState("Waiting...");

	const handleFirstname = (e) => {
		setStatus("Waiting...");
		setFirstname(e.target.value);
	};

	const handleLastname = (e) => {
		setStatus("Waiting...");
		setLastname(e.target.value);
	};

	const handleEmail = (e) => {
		setStatus("Waiting...");
		setEmail(e.target.value);
	};

	const handlePassword = (e) => {
		setStatus("Waiting...");
		setPassword(e.target.value);
	};

	const handleLogin = () => {
		setStatus("Waiting...");
		setIsLogin(true);
	};

	const handleRegister = () => {
		setStatus("Waiting...");
		setIsLogin(false);
	};

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
						setStatus("OK");
						window.location.href = "/Katia/customer";
						break;
					}

					case 1: {
						setStatus("ERROR");
						break;
					}

					case 2: {
						setStatus("ALREADY EXIST");
						break;
					}
				}

				setLockDown(false);
			});
		}
	};

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
					setStatus("OK");
					window.location.href = "/Katia/customer";
				} else {
					setStatus("UNKNOWN USER");
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
						<h3>Connexion {`(${status})`}</h3>
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
						<h3>Inscription {`(${status})`}</h3>
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
