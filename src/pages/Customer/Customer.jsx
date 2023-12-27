import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import "./Customer.scss";
import MyAccount from "./Categories/MyAccount/MyAccount";
import { cipherRequest } from "../../services/KTSec/KTSec";
import Reservation from "./Categories/Reservations/Reservation";
import History from "./Categories/History/History";
import Admin from "./Categories/Admin/Admin";
import { Puff } from "react-loader-spinner";
import config from "../../global.json";
import "hover.css";

/**
 * Page cliente
 * @return {HTMLElement}
 */
export default function Customer() {
    const [userData, setUserData] = useState({});
    const [selectedComponent, setSelectedComponent] = useState(null);

    /**
     * Renvoyer la page de la modification cliente
     * @param {{}} data Informations du client
     * @return {void}
     */
    const handleMyAccount = (data) => {
        setSelectedComponent(<MyAccount data={data} />);
    };

    /**
     * Ouvrir le panel d'administration
     * @return {void}
     */
    const handleAdmin = () => {
        setSelectedComponent(<Admin />);
    };

    /**
     * Supprimer le token + retourner a l'ecran d'accueil
     */
    const revokeToken = () => {
        localStorage.removeItem("katiacm");
        window.location.href = "/Katia/#/home";
    };

    /**
     * Ouvrir la liste des reservations en cours
     * @return {void}
     */
    const handleReservations = () => {
        setSelectedComponent(<Reservation />);
    };

    /**
     * Ouvrir la liste des reservations passe en cours
     * @return {void}
     */
    const handleHistory = () => {
        setSelectedComponent(<History />);
    };

    useEffect(() => {
        if (!localStorage.getItem("katiacm"))
            window.location.href = "/Katia/#/gate";

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/customer/getInfo`).then((res) => {
            if (!res) {
                localStorage.removeItem("katiacm");
                window.location.href = "/Katia/#/gate";
            }

            if (res.status === 0 && res.data) {
                setUserData(res.data);
                handleMyAccount(res.data);
            }
        });
    }, []);

    return (
        <Layout>
            {userData ? (
                <div id="customer-container">
                    <div id="customer-header">
                        <div id="customer-header-txt">
                            <h2 id="customer-title">
                                Heureux de vous voir {userData.firstname} !
                            </h2>

                            <h4 id="customer-subtitle">
                                Sur cette page, trouvez toutes les infos de
                                votre compte client
                            </h4>
                        </div>

                        <button
                            className="btn-deco hvr-shrink"
                            onClick={revokeToken}
                        >
                            <div className="sign">
                                <svg viewBox="0 0 512 512">
                                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                                </svg>
                            </div>
                        </button>
                    </div>

                    <div id="customer-informations-container">
                        <div id="customer-category-container">
                            <div
                                className="customer-category-link"
                                onClick={() => {
                                    handleMyAccount(userData);
                                }}
                            >
                                Mon compte
                            </div>

                            <div
                                className="customer-category-link"
                                onClick={handleReservations}
                            >
                                Mes reservations
                            </div>

                            <div
                                className="customer-category-link"
                                onClick={handleHistory}
                            >
                                Mon historique
                            </div>

                            {userData.type === "admin" ? (
                                <div
                                    className="customer-category-link"
                                    onClick={handleAdmin}
                                >
                                    Admin Panel
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div id="customer-information">{selectedComponent}</div>
                </div>
            ) : (
                <div className="loader">
                    <Puff
                        height="80"
                        width="80"
                        radius={1}
                        color="#cb4a4a"
                        ariaLabel="puff-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            )}
        </Layout>
    );
}
