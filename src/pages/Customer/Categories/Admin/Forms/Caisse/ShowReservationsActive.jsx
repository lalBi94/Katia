import "../popup.scss";
import { useState, useEffect } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import config from "../../../../../../global.json";
import RCode from "../../../../../../components/RCode/RCode";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";

export default function ShowReservationsActive({ handleClose }) {
    const [reservations, setReservation] = useState([]);

    const getActifReservations = () => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/getActiveReservations`
        ).then((res) => {
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
                    label: "Total",
                    field: "total",
                },
                {
                    label: "Action",
                    field: "action",
                },
            ];

            const tab_rows = [];

            for (let i = 0; i <= res.data.length - 1; ++i) {
                tab_rows.push({
                    status: (
                        <span
                            className={`tab-status ${
                                res.data[i].status ? "actif-res" : "inactif-res"
                            }`}
                        >
                            {res.data[i].status ? "Actif" : "Non-Actif"}
                        </span>
                    ),
                    rcode: <RCode code={res.data[i].qrtxt} />,
                    total: (
                        <span className="tab-total">{res.data[i].total}€</span>
                    ),
                    action: (
                        <div className="tab-actions">
                            <button
                                className="tab-btn"
                                onClick={() => {
                                    handleActivate(res.data[i]._id);
                                }}
                            >
                                Activer
                            </button>
                            <button
                                className="tab-btn"
                                onClick={() => {
                                    handleDesactivate(res.data[i]._id);
                                }}
                            >
                                Desactiver
                            </button>
                        </div>
                    ),
                });
            }

            setReservation({
                columns: tab_columns,
                rows: tab_rows,
            });
        });
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
                getActifReservations();
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
                getActifReservations();
            }
        });
    };

    useEffect(() => {
        getActifReservations();
    }, []);

    return (
        <div className="popup-container">
            {reservations.rows ? (
                <div id="popup-table-container">
                    <MDBTable responsive={true}>
                        <MDBTableHead columns={reservations.columns} />
                        <MDBTableBody
                            rows={reservations.rows}
                            color="#ff0000"
                        />
                    </MDBTable>
                </div>
            ) : null}

            <div className="popup-btn-container">
                <button className="btn hvr-shrink" onClick={handleClose}>
                    Quitter
                </button>
            </div>
        </div>
    );
}
