import errorHtml from "./error.html";
import "./error.css";

export default class ErrorView {
    public drawError(): void {
        const rootElement = document.getElementById("root") as HTMLElement;
        rootElement.innerHTML = errorHtml;
    }
}
