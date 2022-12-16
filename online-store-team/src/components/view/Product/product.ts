import productHtml from "./product.html";
import "./product.css";

export default class ProductView {
    public drawProduct(): void {
        document.getElementById("root")!.innerHTML = productHtml;
    }
}
