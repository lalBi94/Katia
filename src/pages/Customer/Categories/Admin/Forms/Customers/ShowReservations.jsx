import { useEffect, useState } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import "../popup.scss";
import config from "../../../../../../global.json";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import RCode from "../../../../../../components/RCode/RCode";

export default function ShowReservation({ handleClose }) {
    const [users, setUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState({});
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/customer/getAllUsers`).then(
            (res) => {
                setUsers(res.data);
            }
        );
    }, []);

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
                handleSelect(selectedUser);
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
                handleSelect(selectedUser);
            }
        });
    };

    const handleSelect = (user) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            userId: user._id,
        });

        cipherRequest(toSend, `${config.api}/reservation/getReservationsOf`)
            .then((res) => {
                const cpy2 = { ...user };
                cpy2.reservations = res.data;
                return cpy2;
            })
            .then((res2) => {
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

                for (let i = 0; i <= res2.reservations.length - 1; ++i) {
                    tab_rows.push({
                        status: (
                            <span
                                className={`tab-status ${
                                    res2.reservations[i].status
                                        ? "actif-res"
                                        : "inactif-res"
                                }`}
                            >
                                {res2.reservations[i].status
                                    ? "Actif"
                                    : "Non-Actif"}
                            </span>
                        ),
                        rcode: <RCode code={res2.reservations[i].qrtxt} />,
                        total: (
                            <span className="tab-total">
                                {res2.reservations[i].total}€
                            </span>
                        ),
                        action: (
                            <div className="tab-actions">
                                <button
                                    className="tab-btn"
                                    onClick={() => {
                                        handleActivate(
                                            res2.reservations[i]._id
                                        );
                                    }}
                                >
                                    Activer
                                </button>
                                <button
                                    className="tab-btn"
                                    onClick={() => {
                                        handleDesactivate(
                                            res2.reservations[i]._id
                                        );
                                    }}
                                >
                                    Desactiver
                                </button>
                            </div>
                        ),
                    });
                }

                setReservations({ columns: tab_columns, rows: tab_rows });
                setSelectedUser(res2);
            });
    };

    const handleDesactivateReservation = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/desactivateReservations`
        ).then((res) => {
            if (res.status === 0) {
                for (
                    let i = 0;
                    i <= selectedUser.reservations.length - 1;
                    ++i
                ) {
                    if (selectedUser.reservations[i]._id === id) {
                        const cpy = { ...selectedUser };
                        cpy.reservations[i].status = false;
                        setSelectedUser(cpy);
                        break;
                    }
                }
            }
        });
    };

    const handleActivateReservation = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/activateReservations`
        ).then((res) => {
            if (res.status === 0) {
                for (
                    let i = 0;
                    i <= selectedUser.reservations.length - 1;
                    ++i
                ) {
                    if (selectedUser.reservations[i]._id === id) {
                        const cpy = { ...selectedUser };
                        cpy.reservations[i].status = true;
                        setSelectedUser(cpy);
                        break;
                    }
                }
            }
        });
    };

    const handleBack = () => {
        setSelectedUser({});
    };

    return users.length > 0 ? (
        <div className="popup-container">
            <div className="popup-list-w-actions">
                {users.length > 0
                    ? Object.keys(users).map((v, k) => (
                          <div
                              className={`popup-list-data ${
                                  selectedUser._id === users[v]._id
                                      ? "active"
                                      : ""
                              }`}
                              key={k}
                              onClick={() => {
                                  handleSelect(users[v]);
                              }}
                          >
                              <span className="popup-list-data-name">
                                  {users[v].firstname} {users[v].lastname}
                              </span>

                              <span className="popup-list-data-lower">
                                  {users[v].createdAt}
                              </span>
                          </div>
                      ))
                    : null}
            </div>

            {selectedUser._id ? (
                <div id="popup-table-container">
                    <MDBTable responsive={true}>
                        <MDBTableHead columns={reservations.columns} />
                        <MDBTableBody rows={reservations.rows} />
                    </MDBTable>
                </div>
            ) : null}

            <div className="popup-btn-container">
                <button className="btn hvr-shrink" onClick={handleClose}>
                    Quitter
                </button>
                <button className="btn hvr-shrink" onClick={handleBack}>
                    Retour
                </button>
            </div>
        </div>
    ) : null;
}
