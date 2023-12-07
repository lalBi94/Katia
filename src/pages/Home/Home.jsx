import Layout from "../../Layout/Layout";
import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { useState, useEffect } from "react";

/**
 * Page d'accueil
 * @return {HTMLElement}
 */
export default function Home() {
	const [test, setTest] = useState({});

	useEffect(() => {
		const data = {
			columns: [
				{
					label: "#",
					field: "id",
					sort: "asc",
				},

				{
					label: "QR Code",
					field: "qrcode",
					sort: "asc",
				},

				{
					label: "Code de réservation",
					field: "cdr",
					sort: "asc",
				},

				{
					label: "Liste",
					field: "list",
					sort: "asc",
				},

				{
					label: "Total",
					field: "total",
					sort: "asc",
				},

				{
					label: "tgggfefsefseggggg"
				},

				{
					label: "fseffesfsefsees"
				}
			],
			rows: [
				{
					id: 1,
					qrcode: "o",
					cdr: "bonjour",
					list: "-list",
					total: 0
				},
				{
					id: 1,
					qrcode: "o",
					cdr: "bonjour",
					list: "-list",
					total: 0
				},
				{
					id: 1,
					qrcode: "o",
					cdr: "bonjour",
					list: "-list",
					total: 0
				},
				{
					id: 1,
					qrcode: "o",
					cdr: "bonjour",
					list: "-list",
					total: 0
				},
				{
					id: 1,
					qrcode: "o",
					cdr: "bonjour",
					list: "-list",
					total: 0
				},
			]
		};

		setTest(data);
	}, []);

	return (
		<Layout>
			<div id="home-container">

			{test.columns ? 
				<MDBTable responsive>
					<MDBTableHead columns={test.columns} />
					<MDBTableBody rows={test.rows} />
				</MDBTable>
			: null}
			
				<Swiper
					pagination={{
						dynamicBullets: true,
					}}
					modules={[Pagination, Autoplay]}
					className="the-swiper"
				></Swiper>
			</div>
		</Layout>
	);
}
