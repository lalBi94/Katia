import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import "./Customer.scss";
import MyAccount from "./Categories/MyAccount/MyAccount";
import { cipherRequest } from "../../services/KTSec/KTSec";

export default function Customer() {
    const [userData, setUserData] = useState({});
    const [selectedComponent, setSelectedComponent] = useState(null);

    const handleMyAccount = (data) => {
        setSelectedComponent(<MyAccount data={data} />);
    };

    const handleReservations = () => {
        setSelectedComponent(null);
    };

    const handleHistory = () => {
        setSelectedComponent(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("katiacm");

        cipherRequest(token, "http://127.0.0.1:3001/customer/getInfo").then(
            (res) => {
                switch (res.status) {
                    case 0: {
                        setUserData(res.data);
                        handleMyAccount(res.data);
                        break;
                    }

                    case 1: {
                        break;
                    }
                }
            }
        );
    }, []);

    return (
        <Layout>
            {userData ? (
                <div id="customer-container">
                    <div id="customer-header">
                        <h2 id="customer-title">
                            Heureux de vous voir {userData.firstname} !
                        </h2>
                        <h4 id="customer-subtitle">
                            Sur cette page, trouvez toutes les infos de votre
                            compte client
                        </h4>
                    </div>

                    <div id="customer-informations-container">
                        <div id="customer-category-container">
                            <li
                                className="customer-category-link"
                                onClick={() => {
                                    handleMyAccount(userData);
                                }}
                            >
                                Mon compte
                            </li>

                            <li className="customer-category-link">
                                Mes reservations
                            </li>
                            <li className="customer-category-link">
                                Mon historique d'achats
                            </li>
                        </div>
                    </div>

                    <div id="customer-information">{selectedComponent}</div>
                </div>
            ) : null}
        </Layout>
    );
}
