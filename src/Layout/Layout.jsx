import NavBar from "../components/NavBar/NavBar";
import "./Layout.scss";

/**
 * Layout de toutes les pages
 * @param {{childen: HTMLElement}} param0
 * @return {HTMLElement}
 */
export default function Layout({ children }) {
    return (
        <div id="layout-container">
            <NavBar />

            <main>{children}</main>

            {/* <Footer /> */}
        </div>
    );
}
