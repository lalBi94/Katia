import { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import { cipherRequest } from "../services/KTSec/KTSec";
import Footer from "../components/Footer/Footer";
import "./Layout.scss"
import config from "../global.json"

/**
 * Layout de toutes les pages
 * @param {{childen: HTMLElement}} param0
 * @return {HTMLElement}
 */
export default function Layout({ children }) {
	useEffect(() => {
		const token = localStorage.getItem("katiacm");

		if (!token) {
			return;
		}

		const toSend = JSON.stringify({ token: token });

		cipherRequest(
			toSend,
			`${config.api}/customer/verifyTokenValidity`
		).then((res) => {
			console.log(res)
			switch (res.status) {
				case 0: {
					break;
				}

				case 1: {
					window.location.href = "/Katia/#/gate";
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

			{/* <Footer /> */}
		</div>
	);
}
