import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../../../global.json";

/**
 * [ADMIN FEATURES] Modifier un produit
 * @param {{handleClose: <void>}} param0 Fonction qui fermera ce formulaire
 * @return {HTMLElement}
 */
export default function ModifyItem({ handleClose }) {
    const [showedItems, setShowedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});
    const [modifyName, setModifyName] = useState("");
    const [modifyPrice, setModifyPrice] = useState("");
    const [modifyPromotion, setModifyPromotion] = useState("");
    const [modifyImgRef, setModifyImgRef] = useState("");
    const [status, setStatus] = useState(null);

    /**
     * Nom du produit
     * @param {Event} e
     */
    const handleModifyName = (e) => {
        setStatus(null);
        setModifyName(e.target.value);
    };

    /**
     * Url de l'image du produit
     * @param {Event} e
     */
    const handleModifyImgRef = (e) => {
        setStatus(null);
        setModifyImgRef(e.target.value);
    };

    /**
     * Prix du produit
     * @param {Event} e
     */
    const handleModifyPrice = (e) => {
        setStatus(null);
        setModifyPrice(e.target.value);
    };

    /**
     * Promotion du produit
     * @param {Event} e
     */
    const handleModifyPromotion = (e) => {
        setStatus(null);
        setModifyPromotion(e.target.value);
    };

    /**
     * Selectionner un produit
     * @param {*} item Produit selectionne
     */
    const handleSelect = (item) => {
        setStatus(null);

        if (JSON.stringify(item) === JSON.stringify(selectedItem)) {
            setSelectedItem({});
        } else {
            setSelectedItem(item);
        }
    };

    /**
     * Modifier le produit selectionner
     * @return {void}
     */
    const handleModify = () => {
        const name = modifyName.length > 0 ? modifyName : selectedItem.name;
        const price = modifyPrice.length > 0 ? modifyPrice : selectedItem.price;
        const promotion =
            modifyPromotion.length > 0
                ? modifyPromotion
                : selectedItem.promotion;
        const imgRef =
            modifyImgRef.length > 0 ? modifyImgRef : selectedItem.imgRef;
        const id = selectedItem._id;

        axios
            .post(`${config.api}/item/modifyItem`, {
                id,
                name,
                price,
                promotion,
                imgRef,
                token: localStorage.getItem("katiacm"),
            })
            .then((res) => {
                setStatus(res.data.status);
            });
    };

    useEffect(() => {
        axios.post(`${config.api}/item/getAllItems`).then((res) => {
            setShowedItems(res.data);
        });
    }, []);

    return (
        <div className="popup-container">
            <span className="popup-title">Modifier un Produit</span>

            {status === 0 ? <p className="succes">Produit modifié !</p> : null}

            {status === 1 ? (
                <p className="error">Un probleme est survenu !</p>
            ) : null}

            <div className="popup-list-w-actions">
                {showedItems.length > 0
                    ? Object.keys(showedItems).map((v, k) => (
                          <div
                              className={`popup-list-data ${
                                  selectedItem._id === showedItems[v]._id
                                      ? "active"
                                      : ""
                              }`}
                              key={k}
                              onClick={() => {
                                  handleSelect(showedItems[v]);
                              }}
                          >
                              <img
                                  className="popup-list-data-img"
                                  src={showedItems[v].imgRef}
                                  alt={`Image de ${showedItems[v].name}`}
                              />
                              <span className="popup-list-data-name">
                                  {showedItems[v].name} ({showedItems[v].price}
                                  €)
                              </span>
                          </div>
                      ))
                    : null}
            </div>

            {selectedItem._id ? (
                <div className="popup-modify">
                    <img
                        className="popup-modify-img"
                        src={selectedItem.imgRef}
                        alt={`Image de ${showedItems.name}`}
                    />
                    <input
                        onChange={handleModifyImgRef}
                        type="text"
                        className="popup-modify-url ipt"
                        placeholder={`URL de l'image: ${selectedItem.imgRef}`}
                    />
                    <input
                        onChange={handleModifyName}
                        type="text"
                        className="popup-modify-title ipt"
                        placeholder={`Nom: ${selectedItem.name}`}
                    />
                    <input
                        onChange={handleModifyPrice}
                        type="number"
                        className="popup-modify-price ipt"
                        placeholder={`Prix: ${selectedItem.price}`}
                    />
                    <input
                        onChange={handleModifyPromotion}
                        type="number"
                        className="popup-modify-promotion ipt"
                        placeholder={`Promotion: ${selectedItem.promotion}`}
                    />
                </div>
            ) : null}

            <div className="popup-btn-container">
                <button className="btn hvr-shrink" onClick={handleModify}>
                    Modifier
                </button>
                <button className="btn hvr-shrink" onClick={handleClose}>
                    Quitter
                </button>
            </div>
        </div>
    );
}
