import { useEffect, useState } from "react";
import config from "../../../../global.json";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import RCode from "../../../../components/RCode/RCode";
import { priceAfterPromo } from "../../../../services/Utils/utils";
import { cipherRequest } from "../../../../services/KTSec/KTSec";
import "./History.scss";
import { Vortex } from "react-loader-spinner";

export default function History() {
    const [reservations, setReservation] = useState([]);
    const [loader, setLoader] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState([]);
    const [advice, setAdvice] = useState([]);
    const [onPopup, setOnPopup] = useState(false);

    const modifyStars = (e, item_id) => {
        const stars = e.target.value;

        if(stars < -1 || stars > 5 || stars === 0 || item_id === "") return

        let cpy = [...advice]

        for(let i = 0; i <= cpy.length-1; ++i) {
            if(cpy[i].item_id === item_id) {
                cpy[i].stars = parseInt(e.target.value)
                break;
            }
        } 

        setAdvice(cpy)
    }

    const modifyMsg = (e, item_id) => {
        let cpy = [...advice]

        if(item_id === "") return

        for(let i = 0; i <= cpy.length-1; ++i) {
            if(cpy[i].item_id === item_id) {
                cpy[i].message = e.target.value
                break;
            }
        } 

        setAdvice(cpy)
    }

    const handlePopupEnter = (items_list) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setSelectedReservation(items_list);

        let stock = []
        for(let i = 0; i <= items_list.length-1; ++i) {
            const toPush = {
                item_id: items_list[i]._id,
                stars: -1,
                message: ""
            }

            stock.push(toPush);
        }

        setAdvice(stock);
        setOnPopup(true);
    };

    const handlePopupExit = () => {
        setOnPopup(false);
    };

    useEffect(() => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/getConfirmedReservationsOf`
        ).then((res) => {
            if (!res.data) {
                setLoader(false);
                return;
            }

            const tab_columns = [
                {
                    label: "QR Code",
                    field: "qrcode",
                },
                {
                    label: "Code",
                    field: "rcode",
                },
                {
                    label: "Panier",
                    field: "panier",
                },
                {
                    label: "Total",
                    field: "total",
                },
            ];

            const tab_rows = [];

            for (let i = 0; i <= res.data.length - 1; ++i) {
                tab_rows.push({
                    qrcode: <img src={res.data[i].qrcode}></img>,
                    rcode: <RCode code={res.data[i].qrtxt} />,
                    panier: (
                        <div className="panier-container">
                            <ul className="panier-container-ul">
                                {Object.keys(res.data[i].items_list).map(
                                    (v, k) => (
                                        <li
                                            className="panier-container-li"
                                            key={k}
                                        >
                                            {res.data[i].items_list[v].name} (
                                            {res.data[i].items_list[v]
                                                .promotion > 0
                                                ? priceAfterPromo(
                                                      res.data[i].items_list[v]
                                                          .price,
                                                      res.data[i].items_list[v]
                                                          .promotion
                                                  ).toFixed(2)
                                                : res.data[i].items_list[v]
                                                      .price}
                                            €)
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ),
                    total: (
                        <span className="tab-total">{res.data[i].total}€</span>
                    ),
                    action: (
                        <div className="tab-actions">
                            <button
                                onClick={() => {
                                    handlePopupEnter(res.data[i].items_list);
                                }}
                                className="btn hvr-shrink tab-btn"
                            >
                                Notez <br /> cette commande
                            </button>
                        </div>
                    ),
                });
            }

            setLoader(false);
            setReservation({ columns: tab_columns, rows: tab_rows });
        });
    }, []);

    return (
        <div id="history-container">
            <div id="history-header-container">
                <h3>Vos précédents achats</h3>
            </div>

            {onPopup ? (
                <div id="popup-container">
                    <div id="popup-header">
                        <h2 id="popup-title">Donner nous votre avis !</h2>
                        <span id="popup-desc">
                            Il nous permettera de savoir ce qui vous plait le
                            plus !
                        </span>
                    </div>

                    <div id="popup-main-container">
                        {selectedReservation
                            ? Object.keys(selectedReservation).map((v, k) => (
                                  <div className="popup-main-elements" key={k}>
                                      <div className="popup-main-elements-name">
                                          {selectedReservation[v].name}
                                      </div>

                                      <div className="popup-main-elements-stars">
                                          <select
                                              id="popup-main-elements-stars-container"
                                              onChange={(e) => {
                                                modifyStars(e, selectedReservation[v]._id)
                                              }}
                                          >
                                              <option
                                                  className="popup-main-elements-star"
                                                  value={-1}
                                              >
                                                  Évaluation du produit
                                              </option>
                                              <option
                                                  className="popup-main-elements-star"
                                                  value={-1}
                                              >
                                                  Ne pas évaluer ce produit
                                              </option>
                                              <option
                                                  className="popup-main-elements-star"
                                                  value={5}
                                              >
                                                  5 Étoiles
                                              </option>
                                              <option
                                                  className="popup-main-elements-star"
                                                  value={4}
                                              >
                                                  4 Étoiles
                                              </option>
                                              <option
                                                  className="popup-main-elements-star"
                                                  value={3}
                                              >
                                                  3 Étoiles
                                              </option>
                                              <option
                                                  className="popup-main-elements-star"
                                                  value={2}
                                              >
                                                  2 Étoiles
                                              </option>
                                              <option
                                                  className="popup-main-elements-star"
                                                  value={1}
                                              >
                                                  1 Étoile
                                              </option>
                                          </select>
                                      </div>

                                      <div className="popup-main-elements-ipt">
                                          <textarea
                                              type="text"
                                              className="popup-textarea"
                                              placeholder="Vous pouvez laisser un message juste ici !"
                                              onChange={(e) => {
                                                modifyMsg(e, selectedReservation[v]._id)
                                              }}
                                          />
                                      </div>
                                  </div>
                              ))
                            : null}
                    </div>

                    <div id="popup-actions-container">
                        <button className="btn hvr-shrink popup-actions">
                            Envoyer
                        </button>
                        <button
                            className="btn hvr-shrink popup-actions"
                            onClick={handlePopupExit}
                        >
                            Annuler
                        </button>
                    </div>
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
                            "#cbfff3",
                            "#d5ffcf",
                            "#cbfff3",
                            "#d5ffcf",
                            "#cbfff3",
                            "#d5ffcf",
                        ]}
                    />
                </div>
            ) : null}

            {reservations.columns ? (
                <MDBTable responsive={true}>
                    <MDBTableHead columns={reservations.columns} />
                    <MDBTableBody rows={reservations.rows} color="#ff0000" />
                </MDBTable>
            ) : null}
        </div>
    );
}
