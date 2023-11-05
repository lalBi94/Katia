import Gate from "../../pages/Gate/Gate";
import Home from "../../pages/Home/Home";
import Shop from "../../pages/Shop/Shop";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Customer from "../../pages/Customer/Customer";

export default function Roaler() {
	const { page } = useParams();
	const [component, setComponent] = useState(null);

	useEffect(() => {
		switch (page) {
			case "home":
				setComponent(<Home />);
				break;
			case "shop":
				setComponent(<Shop />);
				break;
			case "gate":
				setComponent(<Gate />);
				break;
			case "customer":
				setComponent(<Customer />);
				break;
			default:
				setComponent(<div>Cette page n'existe pas !</div>);
		}
	}, [page]);

    return component
}
