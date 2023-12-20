import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { cipherRequest } from "../../services/KTSec/KTSec";
import "./Cart.scss";
import { Vortex } from "react-loader-spinner";
import { Link } from "react-router-dom";
import "hover.css";
import RCode from "../../components/RCode/RCode";
import config from "../../global.json";
import KNotif from "../../components/KNotif/KNotif";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";

/**
 * Panier du client
 * @return {HTMLElement}
 */
export default function Cart() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [codeQR, setCodeQR] = useState(null);
    const [notif, setNotif] = useState(null);
    const [loader, setLoader] = useState(true);
    const [toDisplay, setToDisplay] = useState(null);

    /**
     * Retourner a la boutique
     */
    const goShop = () => {
        location.href = "/Katia/#/shop";
    };

    /**
     * Creation du tableau / fetching des items
     */
    const display = () => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/order/getOrdersOf`).then((res) => {
            switch (res.status) {
                case 0: {
                    if (res.data.length === 0) {
                        setLoader(false);
                        return;
                    }

                    setItems(res.data);

                    const tab_columns = [
                        {
                            label: "Nom du produit",
                            field: "name",
                        },
                        {
                            label: "Quantité",
                            field: "qte",
                        },
                        {
                            label: "Prix",
                            field: "price",
                        },
                        {
                            label: "Action",
                            field: "action",
                        },
                    ];

                    const tab_rows = [];

                    for (let i = 0; i <= res.data.length - 1; ++i) {
                        tab_rows.push({
                            name: (
                                <div className="name-container">
                                    <span className="name">
                                        {res.data[i].name}
                                    </span>
                                    {res.data[i].promotion > 0 ? (
                                        <span className="promo">
                                            {res.data[i].promotion}%
                                        </span>
                                    ) : null}
                                </div>
                            ),
                            qte: (
                                <span className="qte">x{res.data[i].qte}</span>
                            ),
                            price: (
                                <span className="price">
                                    {res.data[i].promotion > 0
                                        ? (
                                              res.data[i].price -
                                              (res.data[i].price *
                                                  res.data[i].promotion) /
                                                  100
                                          ).toFixed(2)
                                        : (
                                              res.data[i].price *
                                              res.data[i].qte
                                          ).toFixed(2)}
                                    €
                                </span>
                            ),
                            action: (
                                <div className="tab-actions">
                                    <button
                                        className="tab-btn plus hvr-shrink"
                                        onClick={() => {
                                            addOrRemoveOneToItemOrder(
                                                res.data[i]._id,
                                                "+",
                                                res.data[i].qte,
                                                i
                                            );
                                        }}
                                    >
                                        +
                                    </button>

                                    <button
                                        className="tab-btn minus hvr-shrink"
                                        onClick={() => {
                                            addOrRemoveOneToItemOrder(
                                                res.data[i]._id,
                                                "-",
                                                res.data[i].qte,
                                                i
                                            );
                                        }}
                                    >
                                        -
                                    </button>

                                    <button
                                        className="tab-btn remove"
                                        onClick={() => {
                                            removeItem(res.data[i]._id, i);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ),
                        });
                    }

                    setToDisplay(
                        <MDBTable responsive={true}>
                            <MDBTableHead columns={tab_columns} />
                            <MDBTableBody rows={tab_rows} />
                        </MDBTable>
                    );

                    calculTotal(res.data);
                    break;
                }

                case 1: {
                    localStorage.removeItem("katiacm");
                    window.location.href = "/Katia/#/gate";
                    break;
                }
            }

            setLoader(false);
        });
    };

    /**
     * Fermer la KNotif
     */
    const closeNotif = () => {
        setNotif(null);
    };

    /**
     * Ouvrir la KNotif
     * @param {string} title Titre de la popup (non implemente encore)
     * @param {string} message Le contenu
     * @param {0|1} status 1: Erreur 0: Succes
     */
    const openNotif = (title, message, status) => {
        setNotif(
            <KNotif message={`${message}`} close={closeNotif} status={status} />
        );
    };

    /**
     * Envoyer le panier dans les reservations
     * @return {void}
     */
    const buy = () => {
        setLoader(true);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            items_list: items,
        });

        cipherRequest(toSend, `${config.api}/reservation/addReservation`)
            .then((res) => {
                switch (res.status) {
                    case 0: {
                        setCodeQR({
                            codeqr: res.codeqr,
                            text: res.codetxt,
                            total: res.total,
                        });

                        openNotif(
                            "Panier",
                            "Votre réservation a bien été pris en compte ! Il ne vous reste plus qu'a présenter ce code au marché et le tour est joué !",
                            0
                        );

                        setToDisplay(null);
                        setTotal(0);
                        break;
                    }

                    case 2: {
                        openNotif(
                            "Panier",
                            "Vous avez depassé le quota autorisé ! (max. 3 réservations)",
                            1
                        );
                        break;
                    }
                }

                setLoader(false);
            })
            .catch((err) => {
                openNotif("Panier", "Veuillez ressayer dans 30 minutes.", 1);
            });
    };

    /**
     * Supprimer un produit du panier
     * @param {string} item_id Identifiant du produit
     * @param {number} id Index du produit dans la liste
     * @return {void}
     */
    const removeItem = (item_id, id) => {
        setLoader(true);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            item_id,
        });

        cipherRequest(toSend, `${config.api}/order/removeItem`).then((res) => {
            if (res.status === 0) {
                display();
                calculTotal(items);
            }

            setLoader(false);
        });
    };

    /**
     * Supprimer l'integralite du panier
     * @return {Promise<void>}
     */
    const clearCart = () => {
        setLoader(true);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/order/removeAllOrdersOf`).then(
            (res) => {
                if (res.status === 0) {
                    openNotif(
                        "Panier",
                        "Votre panier a bien été supprimé !",
                        1
                    );
                    setToDisplay(null);
                    setItems(null);
                }

                setLoader(false);
            }
        );
    };

    /**
     * Augmenter ou baisser la quantite
     * @param {string} item_id Identifiant du produit
     * @param {"+"|"-"} action Choisir si on veut augmenter/diminuer la quantite
     * @param {number} count Quantite du produit
     * @param {number} id Index du produit dans la liste
     * @return {void}
     */
    const addOrRemoveOneToItemOrder = (item_id, action, count, id) => {
        if (parseInt(count, 10) === 1 && action === "-") {
            removeItem(item_id, id);
        }

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            item_id,
            sign: action,
        });

        cipherRequest(
            toSend,
            `${config.api}/order/addOrRemoveOneToItemOrder`
        ).then((res) => {
            switch (res.status) {
                case 0: {
                    display();
                    break;
                }
            }
        });
    };

    /**
     * Calculer le total du panier
     * @param {Array<{}>} data
     */
    const calculTotal = (data) => {
        const parsedData = data.map((item) => {
            return {
                price: parseFloat(item.price),
                qte: parseInt(item.qte),
                promotion: parseInt(item.promotion),
            };
        });

        const total = parsedData.reduce((acc, item) => {
            return (
                acc +
                (item.promotion > 0
                    ? item.price - (item.price * item.promotion) / 100
                    : item.price) *
                    item.qte
            );
        }, 0);

        setTotal(total.toFixed(2));
    };

    useEffect(() => {
        if (!localStorage.getItem("katiacm")) {
            window.location.href = "/Katia/#/gate";
        }

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/customer/getInfo`).then((res) => {
            if (!res) {
                localStorage.removeItem("katiacm");
                window.location.href = "/Katia/#/gate";
            }
        });

        display();
    }, []);

    return (
        <Layout>
            {notif || null}

            {codeQR ? (
                <div id="codeQR-big-container">
                    <h2>
                        Votre commande a été validée.
                        <br />
                        <span id="codeQR-thx">Merci pour votre achat !</span>
                    </h2>

                    <table id="codeQR-container">
                        <thead id="codeQR-headers">
                            <tr id="codeQR-headers-line">
                                <th className="codeQR-header">Code QR</th>
                                <th className="codeQR-header">
                                    Code de reservation
                                </th>
                                <th className="codeQR-header">Montant (TTC)</th>
                            </tr>
                        </thead>

                        <tbody id="codeQR-datas">
                            <tr id="codeQR-datas-line">
                                <td className="codeQR-data">
                                    <img
                                        src={codeQR.codeqr}
                                        alt={`Code QR contenant le texte : ${codeQR.text}`}
                                    />
                                </td>

                                <td className="codeQR-data res">
                                    <RCode code={codeQR.text} />
                                </td>

                                <td className="codeQR-data">
                                    <span>{codeQR.total}€</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Link
                        id="codeQR-redirection"
                        className="hvr-shrink"
                        to="/customer"
                    >
                        Aller sur votre <b>Espace Client</b>
                    </Link>
                </div>
            ) : null}

            {loader ? (
                <div className="loader">
                    <Vortex
                        visible={true}
                        height="100"
                        width="100"
                        radius={1}
                        ariaLabel="vortex-loading"
                        wrapperStyle={{}}
                        wrapperClass="vortex-wrapper"
                        colors={[
                            "#cedbfe",
                            "#fecfef",
                            "#cedbfe",
                            "#fecfef",
                            "#cedbfe",
                            "#fecfef",
                        ]}
                    />
                </div>
            ) : null}

            {toDisplay ? (
                <div id="cart-table-container">
                    {toDisplay}

                    <div id="cart-total-container">
                        <div id="cart-total-btns">
                            <button
                                className="cart-total-btn hvr-shrink"
                                onClick={() => {
                                    buy();
                                }}
                            >
                                Réserver ({total}€ TTC)
                            </button>

                            <button
                                className="cart-total-btn hvr-shrink"
                                onClick={clearCart}
                            >
                                Vider
                            </button>

                            <button className="cart-total-btn" onClick={goShop}>
                                Retourner à la boutique
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Layout>
    );
}
