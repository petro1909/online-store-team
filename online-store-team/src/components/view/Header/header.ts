import "./header.css";
import HeaderHtml from "./header.html";

export default class HeaderView {
    public drawHeader(): void {
        document.getElementById("header")!.innerHTML = HeaderHtml;
    }
}
