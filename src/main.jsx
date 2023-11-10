import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Gate from "./pages/Gate/Gate";
import Home from "./pages/Home/Home";
import "./main.scss";
import Customer from "./pages/Customer/Customer";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart/Cart";
//import { StrictMode } from 'react';

const router = createBrowserRouter([
	{ path: "/", element: <Home /> },
	{ path: "/Katia/", element: <Home /> },
	{ path: "/Katia/home", element: <Home /> },
	{ path: "/Katia/gate", element: <Gate /> },
	{ path: "/Katia/customer", element: <Customer /> },
	{ path: "/Katia/shop", element: <Shop /> },
	{ path: "/Katia/cart", element: <Cart /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	// <StrictMode>
		<RouterProvider router={router} />
	// </StrictMode>
);
