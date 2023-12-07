import "./RCode.scss";
import clipboardCopy from "clipboard-copy";

/**
 * Affichage des codes de reservation
 * @param {{code: string}} param0
 * @return {HTMLElement}
 */
export default function RCode({ code }) {
	const copy = (e) => {
		e.target.style.background = "#349734"
		e.target.style.color = "#fff"
		clipboardCopy(code)

		setTimeout(() => {
			e.target.style.background = "#E7E7E7"
			e.target.style.color = "#2b2b2b"
		}, 500)
	}

	return <span className="reservation" onClick={copy}>{code}</span>;
}
