/** 
	$-------------------------------------------$
	|            Frontend du client 	        |
	| @name katia-client 					    |
	| @version 1.0 					   		    |
	| @license MIT 					            |
	| @link https://github.com/lalBi94/Katia    |
	| @copyright Les delices de Katia 		    |
	| @contact : bilal.boudjemline@etu.u-pec.fr |
	| @contact : ethan.brezeky@etu.u-pec.fr 	|
	$-------------------------------------------$
*/

import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Gate from "./pages/Gate/Gate";
import Home from "./pages/Home/Home";
import "./main.scss";
import Customer from "./pages/Customer/Customer";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart/Cart";
import { StrictMode } from 'react';

const router = createHashRouter([
	{ path: "/", element: <Home /> },
	{ path: "/home", element: <Home /> },
	{ path: "/gate", element: <Gate /> },
	{ path: "/customer", element: <Customer /> },
	{ path: "/shop", element: <Shop /> },
	{ path: "/cart", element: <Cart /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<RouterProvider router={router} />
);
