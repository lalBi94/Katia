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
	return (
		<div id="layout-container">
			<NavBar />

			<main>{children}</main>

			{/* <Footer /> */}
		</div>
	);
}
