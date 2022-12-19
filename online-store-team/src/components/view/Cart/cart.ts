import cartHtml from "./cart.html";
import "./cart.css";
import Cart from "../../model/Cart";

export default class CartView {
    public drawCart(cart: Cart, page: number): void {
        document.getElementById("root")!.innerHTML = cartHtml;
    }
}
