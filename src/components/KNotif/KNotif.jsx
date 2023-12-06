import "./KNotif.scss";
import { motion } from "framer-motion";

export default function KNotif({
	title = null,
	message,
	close,
	status = 0,
	addons = null,
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5, x: 0 }}
			animate={{
				opacity: 1,
				scale: 1,
				position: "fixed",
				left: "5px",
				top: "5px",
			}}
			transition={{
				duration: 0.8,
				delay: 0.5,
				ease: [0, 0.71, 0.2, 1.01],
			}}
			className={`notif-container ${
				status === 0
					? "notif-success"
					: status === 1
					? "notif-error"
					: "notif-info"
			}`}
		>
			<button onClick={close} className="notif-close">
				×
			</button>

			{title && <span className="notif-title">{title}</span>}

			<span className="notif-text">{message}</span>

			{addons !== null ?? <div className="notif-addons">{addons}</div>}
		</motion.div>
	);
}
