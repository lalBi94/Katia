import "./MyAccount.scss";

export default function MyAccount({ data }) {
    return (
        <div id="myaccount-container">
            <div className="data-container data">
                <span>{data.firstname}</span>
                <span className="data-modifier">🖊️</span>
            </div>

            <div className="data-container data">
                <span>{data.lastname}</span>
                <span className="data-modifier">🖊️</span>
            </div>

            <div className="data-container data">
                <span>{data.email}</span>
                <span className="data-modifier">🖊️</span>
            </div>

            <div className="data-container data">
                <span>Mot de passe</span>
                <span className="data-modifier">🖊️</span>
            </div>

            <div className="data-container">
                <span id="identifier">N° Client {data.createdAt}</span>
                <span>&nbsp;</span>
            </div>
        </div>
    );
}
