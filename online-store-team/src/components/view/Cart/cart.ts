import cartHtml from "./cart.html";
import "./cart.css";

export default class CartView {
    public drawCart(): void {
        document.getElementById("root")!.innerHTML = cartHtml;
    }
}
