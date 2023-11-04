import { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import { cipherRequest } from "../services/KTSec/KTSec";

export default function Layout({ children }) {
	useEffect(() => {
		const token = localStorage.getItem("katiacm");

		if (!token) {
			return;
		}

		const toSend = JSON.stringify({ token: token });

		cipherRequest(
			toSend,
			"https://katia-api.osc-fr1.scalingo.io/customer/verifyTokenValidity"
		).then((status) => {
			switch (status.status) {
				case 0: {
					break;
				}

				case 1: {
					window.location.href = "/gate";
					localStorage.removeItem("katiacm");
					break;
				}
			}
		});
	}, []);

	return (
		<div id="layout-container">
			<NavBar />

			<main>{children}</main>
		</div>
	);
}
