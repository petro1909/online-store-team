import errorHtml from "./error.html";
import "./error.css";

export default class ErrorView {
    public drawError(): void {
        document.getElementById("root")!.innerHTML = errorHtml;
    }
}
