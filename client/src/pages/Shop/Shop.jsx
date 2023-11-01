import "./Shop.scss";
import Layout from "../../Layout/Layout"
import {useEffect, useState} from "react"

export default function Shop() {
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems([
            {name: "Sushi", price: 1.0, promo: 20},
            {name: "Maki Thon", price: 4.50, promo: 0},
            {name: "Carolina Rolces", price: 5.0, promo: 50}
        ])
    }, [setItems])

    return (
        <Layout>
            <div id="shop-container">
                {items.length > 0 ? 
                    Object.keys(items).map((v, k) => (
                        <div className="item-container" key={k}>
                            <span className="item-title">
                                {items[v].name}
                            </span>
                            
                            <span className="item-price">
                                {items[v].price}
                            </span>

                            <span>
                                {items[v].promo > 0 ? 
                                    `${items[v].promo}%` 
                                : null}
                            </span>
                        </div>
                    ))
                : "tg"}
            </div>
        </Layout>
    );
}
