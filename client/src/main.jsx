import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Gate from "./pages/Gate/Gate";
import Home from "./pages/Home/Home";
import "./main.scss";
import Customer from "./pages/Customer/Customer";
import Shop from "./pages/Shop/Shop";

const router = createBrowserRouter([
	{ path: "/", element: <Home /> },
	{ path: "/home", element: <Home /> },
	{ path: "/gate", element: <Gate /> },
	{ path: "/customer", element: <Customer /> },
	{ path: "/shop", element: <Shop /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<RouterProvider router={router} />
);
