import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Roaler from "./components/Roaler/Roaler";

const router = createBrowserRouter([
	{ path: "/Katia/:page", element: <Roaler /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<RouterProvider router={router} />
);