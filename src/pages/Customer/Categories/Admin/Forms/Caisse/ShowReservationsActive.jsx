import "../popup.scss";
import { useState, useEffect } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import config from "../../../../../../global.json";
import RCode from "../../../../../../components/RCode/RCode";

export default function ShowReservationsActive({ handleClose }) {
	const [reservations, setReservation] = useState([]);

	const handleBack = () => {
		setReservation([]);
	};

	useEffect(() => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
		});

		cipherRequest(
			toSend,
			`${config.api}/reservation/getActiveReservations`
		).then((res) => {
			console.log(res.data);
			setReservation(res.data);
		});
	}, []);

	return (
		<div className="popup-container">
			{reservations.length > 0 ? (
				<table className="popup-modify">
					<tbody>
						{Object.keys(reservations).map((v, k) => (
							<tr
								key={k}
								className={`popup-reservations-rows ${
									reservations[v].status
										? "available"
										: "notavailable"
								}`}
							>
								<td>
									<img
										className="popup-modify-img"
										src={reservations[v].qrcode}
										alt=""
									/>
								</td>
								<td style={{ color: "black" }}>
									<RCode code={reservations[v].qrtxt} />
								</td>
								<td className="list">
									{Object.keys(
										reservations[v].items_list
									).map((vv, kk) => (
										<span
											key={kk}
										>{`- (x${reservations[v].items_list[vv].qte}) ${reservations[v].items_list[vv].name}`}</span>
									))}
								</td>
								<td>{reservations[v].total} €</td>
								<td>
									<div className="btn-grp">
										<button
										// onClick={() => {
										// 	handleActivateReservation(
										// 		selectedUser.reservations[v]
										// 			._id
										// 	);
										// }}
										>
											Activer
										</button>
										<button
										// onClick={() => {
										// 	handleDesactivateReservation(
										// 		selectedUser.reservations[v]
										// 			._id
										// 	);
										// }}
										>
											Desactiver
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : null}

			<div className="popup-btn-container">
				<button className="btn hvr-shrink" onClick={handleClose}>
					Quitter
				</button>
				<button className="btn hvr-shrink" onClick={handleBack}>
					Retour
				</button>
			</div>
		</div>
	);
}
