import { useEffect, useState } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import "../popup.scss";
import config from "../../../../../../global.json";
import RCode from "../../../../../../components/RCode/RCode";

export default function ShowReservation({ handleClose }) {
	const [users, setUsers] = useState({});
	const [selectedUser, setSelectedUser] = useState({});

	useEffect(() => {
		const toSend = JSON.stringify({
			token: localStorage.getItem("katiacm"),
		});

		cipherRequest(toSend, `${config.api}/customer/getAllUsers`).then(
			(res) => {
				setUsers(res.data);
			}
		);
	}, []);

	const handleSelect = (user) => {
		if (selectedUser._id !== user._id) {
			const toSend = JSON.stringify({
				token: localStorage.getItem("katiacm"),
				userId: user._id,
			});

			cipherRequest(toSend, `${config.api}/reservation/getReservationsOf`)
				.then((res) => {
					let cpy2 = { ...user };
					cpy2.reservations = res.data;
					return cpy2;
				})
				.then((res2) => {
					console.log(res2);
					setSelectedUser(res2);
				});
		}
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
				for (
					let i = 0;
					i <= selectedUser.reservations.length - 1;
					++i
				) {
					if (selectedUser.reservations[i]._id === id) {
						const cpy = { ...selectedUser };
						cpy.reservations[i].status = false;
						setSelectedUser(cpy);
						break;
					}
				}
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
				for (
					let i = 0;
					i <= selectedUser.reservations.length - 1;
					++i
				) {
					if (selectedUser.reservations[i]._id === id) {
						const cpy = { ...selectedUser };
						cpy.reservations[i].status = true;
						setSelectedUser(cpy);
						break;
					}
				}
			}
		});
	};

	const handleBack = () => {
		setSelectedUser({});
	};

	return users.length > 0 ? (
		<div className="popup-container">
			<div className="popup-list-w-actions">
				{users.length > 0
					? Object.keys(users).map((v, k) => (
							<div
								className={`popup-list-data ${
									selectedUser._id === users[v]._id
										? "active"
										: ""
								}`}
								key={k}
								onClick={() => {
									handleSelect(users[v]);
								}}
							>
								<span className="popup-list-data-name">
									{users[v].firstname} {users[v].lastname}
								</span>

								<span className="popup-list-data-lower">
									{users[v].createdAt}
								</span>
							</div>
					  ))
					: null}
			</div>

			{selectedUser._id ? (
				<table className="popup-modify">
					<tbody>
						{Object.keys(selectedUser.reservations).map((v, k) => (
							<tr
								key={k}
								className={`popup-reservations-rows ${
									selectedUser.reservations[v].status
										? "available"
										: "notavailable"
								}`}
							>
								<td>
									<img
										className="popup-modify-img"
										src={
											selectedUser.reservations[v].qrcode
										}
										alt=""
									/>
								</td>
								<td style={{ color: "black" }}>
									<RCode
										code={
											selectedUser.reservations[v].qrtxt
										}
									/>
								</td>
								<td className="list">
									{Object.keys(
										selectedUser.reservations[v].items_list
									).map((vv, kk) => (
										<span
											key={kk}
										>{`- (x${selectedUser.reservations[v].items_list[vv].qte}) ${selectedUser.reservations[v].items_list[vv].name}`}</span>
									))}
								</td>
								<td>{selectedUser.reservations[v].total} €</td>
								<td>
									<div className="btn-grp">
										<button
											onClick={() => {
												handleActivateReservation(
													selectedUser.reservations[v]
														._id
												);
											}}
										>
											Activer
										</button>
										<button
											onClick={() => {
												handleDesactivateReservation(
													selectedUser.reservations[v]
														._id
												);
											}}
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
	) : null;
}
