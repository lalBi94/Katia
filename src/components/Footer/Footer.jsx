import "./Footer.scss";
import { Link } from "react-router-dom";
import "hover.css";

/**
 * Footer du site internet
 * @return {HTMLElement}
 */
export default function Footer() {
    return (
        <footer id="footer-container">
            <div id="footer-socials">
                <div id="footer-socials-msg">
                    Get connected with us on social networks
                </div>

                <div id="footer-socials-logos">
                    <Link to="/home" className="footer-socials-logo hvr-shrink">
                        <img
                            src="https://icons.iconarchive.com/icons/fa-team/fontawesome-brands/512/FontAwesome-Brands-Facebook-icon.png"
                            alt="logo de facebook"
                        />
                    </Link>

                    <Link to="/home" className="footer-socials-logo hvr-shrink">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Font_Awesome_5_brands_instagram.svg/1200px-Font_Awesome_5_brands_instagram.svg.png"
                            alt="logo d'instagram"
                        />
                    </Link>

                    <Link to="/home" className="footer-socials-logo hvr-shrink">
                        <img
                            src="https://www.veryicon.com/download/png/miscellaneous/font-awesome-2/snapchat-ghost-3?s=256"
                            alt="logo de snapchat"
                        />
                    </Link>
                </div>
            </div>

            <div id="footer-cat-container">
                <div className="footer-cat">
                    <span className="footer-cat-title">
                        Les Délices de Katia
                    </span>
                    <span className="footer-cat-msg">
                        Traiteur à Fontainebleau, pour une cuisine raffinée et
                        savoureuse à tous les événements.
                    </span>
                </div>

                <div className="footer-cat">
                    <span className="footer-cat-title">Lien utiles</span>
                    <span className="footer-cat-msg">
                        Traiteur à Fontainebleau, pour une cuisine raffinée et
                        savoureuse à tous les événements.
                    </span>
                </div>

                <div className="footer-cat">
                    <span className="footer-cat-title">Contact</span>
                    <span className="footer-cat-msg">
                        Traiteur à Fontainebleau, pour une cuisine raffinée et
                        savoureuse à tous les événements.
                    </span>
                </div>
            </div>
        </footer>
    );
}
