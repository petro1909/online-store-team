import "./footer.css";
import FooterHtml from "./footer.html";

export default class FooterView {
    public drawFooter(): void {
        document.getElementById("footer")!.innerHTML = FooterHtml;
    }
}
