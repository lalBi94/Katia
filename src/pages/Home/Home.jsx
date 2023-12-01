import Layout from "../../Layout/Layout";
import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Slide1 from "../../assets/slide1.webp"

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
				>
					<SwiperSlide>
						<img src={Slide1} alt="" />
					</SwiperSlide>

					<SwiperSlide>
						<img src={Slide1} alt="" />
					</SwiperSlide>

					<SwiperSlide>
						<img src={Slide1} alt="" />
					</SwiperSlide>
				</Swiper>
			</div>
		</Layout>
	);
}
