import "../popup.scss";
import { useState } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import config from "../../../../../../global.json";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import RCode from "../../../../../../components/RCode/RCode";
import { priceAfterPromo } from "../../../../../../services/Utils/utils";

export default function CheckCode({ handleClose }) {
    const [reservationInfo, setReservationInfo] = useState({ found: false });
    const [code, setCode] = useState("");

    const handleCode = (e) => {
        const cd = e.target.value.toUpperCase();
        e.target.value = cd;
        setCode(cd);
    };

    const handleBack = () => {
        setReservationInfo({ found: false });
    };

    const handleSearch = () => {
        if (code.length <= 5) return;

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            code,
        });

        cipherRequest(toSend, `${config.api}/reservation/getRFromCode`).then(
            (res) => {
                res.info.found = true;

                const tab_columns = [
                    {
                        label: "Status",
                        field: "status",
                    },
                    {
                        label: "Code",
                        field: "rcode",
                    },
                    {
                        label: "Panier",
                        field: "panier"
                    },
                    {
                        label: "Total",
                        field: "total",
                    },
                    {
                        label: "Action",
                        field: "action",
                    },
                ];

                const tab_rows = [
                    {
                        status: (
                            <span
                                className={`tab-status ${
                                    res.info.status
                                        ? "actif-res"
                                        : "inactif-res"
                                }`}
                            >
                                {res.info.status ? "Actif" : "Non-Actif"}
                            </span>
                        ),
                        rcode: <RCode code={res.info.qrtxt} />,

                        panier: (
                            <div className="panier-container">
                                <ul className="panier-container-ul">
                                        {Object.keys(res.info.items_list).map((v, k) => (
                                            <li className="panier-container-li" key={k}>{res.info.items_list[v].name} ({ res.info.items_list[v].promotion > 0 ? (priceAfterPromo(res.info.items_list[v].price, res.info.items_list[v].promotion)).toFixed(2) : (res.info.items_list[v].price)}€)</li>
                                        ))}
                                </ul>
                            </div>
                        ),

                        total: (
                            <span className="tab-total">{res.info.total}€</span>
                        ),
                        action: (
                            <div className="tab-actions">
                                <button
                                    className="tab-btn"
                                    onClick={() => {
                                        handleActivate(res.info._id);
                                    }}
                                >
                                    Activer
                                </button>
                                <button
                                    className="tab-btn"
                                    onClick={() => {
                                        handleDesactivate(res.info._id);
                                    }}
                                >
                                    Desactiver
                                </button>
                            </div>
                        ),
                    },
                ];

                setReservationInfo({
                    columns: tab_columns,
                    rows: tab_rows,
                });
            }
        );
    };

    const handleActivate = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/activateReservations`
        ).then((res) => {
            if (res.status === 0) {
                handleSearch();
            }
        });
    };

    const handleDesactivate = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/desactivateReservations`
        ).then((res) => {
            if (res.status === 0) {
                handleSearch();
            }
        });
    };

    return (
        <div className="popup-container">
            {!reservationInfo.found ? (
                <input
                    maxLength={6}
                    onChange={handleCode}
                    className="ipt"
                    type="search"
                    placeholder="Code de réservation (6 characteres)"
                />
            ) : null}

            {reservationInfo.columns ? (
                <div id="popup-table-container">
                    <MDBTable responsive={true}>
                        <MDBTableHead columns={reservationInfo.columns} />
                        <MDBTableBody
                            rows={reservationInfo.rows}
                            color="#ff0000"
                        />
                    </MDBTable>
                </div>
            ) : null}

            <div className="popup-btn-container">
                <button className="btn hvr-shrink" onClick={handleSearch}>
                    Rechercher
                </button>

                <button className="btn hvr-shrink" onClick={handleBack}>
                    Retour
                </button>

                <button className="btn hvr-shrink" onClick={handleClose}>
                    Quitter
                </button>
            </div>
        </div>
    );
}
