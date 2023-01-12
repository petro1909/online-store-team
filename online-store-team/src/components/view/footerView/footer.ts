import "./footer.css";
import FooterHtml from "./footer.html";

export default class FooterView {
    public drawFooter(): void {
        const footer = document.getElementById("footer") as HTMLElement;
        footer.innerHTML = FooterHtml;
    }
}
