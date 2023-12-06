import "../popup.scss";
import { useState } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import config from "../../../../../../global.json";

export default function CheckCode({ handleClose }) {
	const [reservationInfo, setReservationInfo] = useState({ found: false });
	const [code, setCode] = useState("");

	const handleCode = (e) => {
		const cd = e.target.value.toUpperCase();
		e.target.value = cd;
		setCode(cd);
	};

	const handleBack = () => {
		setReservationInfo({ found: false });
	};

	const handleDesactivateReservation = (id) => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
			reservation_id: id,
		});

		cipherRequest(
			toSend,
			`${config.api}/reservation/desactivateReservations`
		).then((res) => {
			if (res.status === 0) {
				const cpy = { ...reservationInfo };
				cpy.status = false;
				setReservationInfo(cpy);
			}
		});
	};

	const handleActivateReservation = (id) => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
			reservation_id: id,
		});

		cipherRequest(
			toSend,
			`${config.api}/reservation/activateReservations`
		).then((res) => {
			if (res.status === 0) {
				const cpy = { ...reservationInfo };
				cpy.status = true;
				setReservationInfo(cpy);
			}
		});
	};

	const handleSearch = () => {
		if (code.length <= 5) return;

		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
			code,
		});

		cipherRequest(toSend, `${config.api}/reservation/getRFromCode`).then(
			(res) => {
				res.info.found = true;
				setReservationInfo(res.info);
				console.log(res.info);
			}
		);
	};

	return (
		<div className="popup-container">
			{!reservationInfo.found ? (
				<input
					maxLength={6}
					onChange={handleCode}
					className="ipt"
					type="search"
					placeholder="Code de réservation (6 characteres)"
				/>
			) : null}

			{reservationInfo._id ? (
				<table className="popup-modify">
					<tbody>
						<tr
							className={`popup-reservations-rows ${
								reservationInfo.status
									? "available"
									: "notavailable"
							}`}
						>
							<td>
								<img
									className="popup-modify-img"
									src={reservationInfo.qrcode}
									alt=""
								/>
							</td>
							<td>
								<span>{reservationInfo.qrtxt}</span>
							</td>
							<td className="list">
								{Object.keys(reservationInfo.items_list).map(
									(vv, kk) => (
										<span key={kk}>
											{`- (x${reservationInfo.items_list[vv].qte}) ${reservationInfo.items_list[vv].name}`}
										</span>
									)
								)}
							</td>
							<td>{reservationInfo.total} €</td>
							<td className="btn-grp">
								<button
									onClick={() => {
										handleActivateReservation(
											reservationInfo._id
										);
									}}
								>
									Activer
								</button>
								<button
									onClick={() => {
										handleDesactivateReservation(
											reservationInfo._id
										);
									}}
								>
									Desactiver
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			) : null}

			<div className="popup-btn-container">
				<button className="btn hvr-shrink" onClick={handleSearch}>
					Rechercher
				</button>

				<button className="btn hvr-shrink" onClick={handleBack}>
					Retour
				</button>

				<button className="btn hvr-shrink" onClick={handleClose}>
					Quitter
				</button>
			</div>
		</div>
	);
}
