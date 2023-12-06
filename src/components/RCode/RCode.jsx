import "./RCode.scss";

/**
 * Affichage des codes de reservation
 * @param {{code: string}} param0
 * @return {HTMLElement}
 */
export default function RCode({ code }) {
	return <span className="reservation">{code}</span>;
}
