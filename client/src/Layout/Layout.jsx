import { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import axios from "axios";

export default function Layout({ children }) {
    useEffect(() => {
        const token = localStorage.getItem("katiacm");
        if (!token) return;

        axios
            .post("http://localhost:3001/customer/verifyTokenValidity", {
                token: token,
            })
            .then((result) => {
                switch (result.data.status) {
                    case 0: {
                        break;
                    }

                    case 1: {
                        localStorage.removeItem("katiacm");
                        window.location.reload();
                    }
                }
            });
    }, []);

    return (
        <>
            <NavBar />

            <main>{children}</main>
        </>
    );
}
