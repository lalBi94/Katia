import Layout from "../../Layout/Layout";
import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

/**
 * Page d'accueil
 * @return {HTMLElement}
 */
export default function Home() {
	return (
		<Layout>
			<div id="home-container">
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
