import errorHtml from "./error.html";
import { app } from "../../../index";
import "./error.css";

export default class ErrorView {
    public drawError(): void {
        document.getElementById("root")!.innerHTML = errorHtml;
        const pageButton = document.getElementById("page-button") as HTMLButtonElement;
        pageButton.onclick = () => {
            app.router.route("/");
        }
    }
}
