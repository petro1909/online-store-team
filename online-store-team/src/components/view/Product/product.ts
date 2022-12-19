import productHtml from "./product.html";
import "./product.css";

export default class ProductView {
    public drawProduct(product: Product, cart: Cart): void {
        document.getElementById("root")!.innerHTML = productHtml;
    }
}
