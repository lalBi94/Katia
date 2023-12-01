import { useState } from "react";
import "./MyAccount.scss";
import "hover.css";
import { cipherRequest } from "../../../../services/KTSec/KTSec";
import config from "../../../../global.json"

/**
 * Visualiser les informations du client
 * @param {{data: {}}} param0 
 * @return {HTMLElement}
 */
export default function MyAccount({ data }) {
	const [firstNameM, setFirstNameM] = useState("");
	const [lastNameM, setLastNameM] = useState("");
	const [emailM, setEmailM] = useState("");
	//const [passwordM, setPasswordM] = useState("");
	const [isErr, setIsErr] = useState({ flag: false, status: -1 });
	const [isModify, setIsModify] = useState({
		firstname: false,
		lastname: false,
		password: false,
		email: false,
	});

	const handleIsModify = (field) => {
		setIsErr({ flag: false, status: -1 });
		setIsModify({ ...isModify, [field]: !isModify[field] });
	};

	/**
	 * Email du client
	 * @param {Event} e 
	 */
	const handleEmail = (e) => {
		setEmailM(e.target.value);
	};

	/**
	 * Prenom du client
	 * @param {Event} e 
	 */
	const handleFirstname = (e) => {
		setFirstNameM(e.target.value);
	};

	/**
	 * Nom de famille du client
	 * @param {Event} e 
	 */
	const handleLastname = (e) => {
		setLastNameM(e.target.value);
	};

	/**
	 * Changer une des inputs
	 * @param {"email"|"firstname"|"lastname"|} what Mode de changement
	 */
	const changeData = (what) => {
		switch (what) {
			case "firstname": {
				const toSend = JSON.stringify({
					firstname: firstNameM,
					token: localStorage.getItem("katiacm"),
				});
				cipherRequest(
					toSend,
					`${config.api}/customer/changeFirstname`
				).then((status) => {
					switch (status.data.status) {
						case 0: {
							setIsErr({ flag: true, status: 0 });
							break;
						}

						case 1: {
							setIsErr({ flag: false, status: 1 });
							break;
						}
					}
				});

				setFirstNameM("");
				handleIsModify("firstname");
				break;
			}

			case "lastname": {
				const toSend = JSON.stringify({
					lastname: lastNameM,
					token: localStorage.getItem("katiacm"),
				});
				cipherRequest(
					toSend,
					`${config.api}/customer/changeLastname`
				).then((status) => {
					switch (status.data.status) {
						case 0: {
							setIsErr({ flag: true, status: 0 });
							break;
						}

						case 1: {
							setIsErr({ flag: false, status: 1 });
							break;
						}
					}
				});

				setLastNameM("");
				handleIsModify("lastname");
				break;
			}

			case "email": {
				const toSend = JSON.stringify({
					email: emailM,
					token: localStorage.getItem("katiacm"),
				});
				cipherRequest(
					toSend,
					`${config.api}/customer/changeEmail`
				).then((status) => {
					switch (status.data.status) {
						case 0: {
							setIsErr({ flag: true, status: 0 });
							break;
						}

						case 1: {
							setIsErr({ flag: false, status: 1 });
							break;
						}

						case 2: {
							setIsErr({ flag: false, status: 2 });
							break;
						}
					}
				});

				setEmailM("");
				handleIsModify("email");
				break;
			}
		}
	};

	return (
		<div id="myaccount-container">
			{!isErr.flag && isErr.status === 1 ? (
				<p id="error">
					Une erreur est survenue !
				</p>
			) : null}

			{!isErr.flag && isErr.status === 2 ? (
				<p id="error">
					Cet email n'est pas disponible !
					</p>
			) : null}

			{isErr.flag && isErr.status === 0 ? (
				<p id="succes">
					Reconnectez vous pour voir les modifications !
				</p>
			) : null}

			{!isModify.firstname ? (
				<div className="data-container data">
					<span>{data.firstname}</span>
					<span
						className="data-modifier"
						onClick={() => handleIsModify("firstname")}
					>
						🖊️
					</span>
				</div>
			) : (
				<div className="data-container data">
					<input
						type="texte"
						onChange={handleFirstname}
						placeholder={data.firstname}
					/>
					<div className="data-modif-btns">
						<button
							className="data-modif-btn hvr-grow"
							onClick={() => changeData("firstname")}
						>
							Modifier
						</button>
						<button
							className="data-modif-btn hvr-grow"
							onClick={() => handleIsModify("firstname")}
						>
							Annuler
						</button>
					</div>
				</div>
			)}

			{!isModify.lastname ? (
				<div className="data-container data">
					<span>{data.lastname}</span>
					<span
						className="data-modifier"
						onClick={() => handleIsModify("lastname")}
					>
						🖊️
					</span>
				</div>
			) : (
				<div className="data-container data">
					<input
						type="texte"
						onChange={handleLastname}
						placeholder={data.lastname}
					/>
					<div className="data-modif-btns">
						<button
							className="data-modif-btn hvr-grow"
							onClick={() => changeData("lastname")}
						>
							Modifier
						</button>
						<button
							className="data-modif-btn hvr-grow"
							onClick={() => handleIsModify("lastname")}
						>
							Annuler
						</button>
					</div>
				</div>
			)}

			{!isModify.email ? (
				<div className="data-container data">
					<span>{data.email}</span>
					<span
						className="data-modifier"
						onClick={() => handleIsModify("email")}
					>
						🖊️
					</span>
				</div>
			) : (
				<div className="data-container data">
					<input
						type="texte"
						onChange={handleEmail}
						placeholder={data.email}
					/>
					<div className="data-modif-btns">
						<button
							className="data-modif-btn hvr-grow"
							onClick={() => changeData("email")}
						>
							Modifier
						</button>
						<button
							className="data-modif-btn hvr-grow"
							onClick={() => handleIsModify("email")}
						>
							Annuler
						</button>
					</div>
				</div>
			)}

			<div className="data-container data">
				<span>*********</span>
				<span className="data-modifier">🖊️</span>
			</div>

			<div className="data-container">
				<span id="identifier">N° Client {data.createdAt}</span>
				<span>&nbsp;</span>
			</div>
		</div>
	);
}
