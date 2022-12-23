import "./header.css";
import HeaderHtml from "./header.html";
import Cart from "../../model/Cart";

export default class HeaderView {
    public drawHeader(cart: Cart): void {
        document.getElementById("header")!.innerHTML = HeaderHtml;
        document.querySelector(".cart-total__cost")!.innerHTML = String(cart.totalPrice);
        document.querySelector(".cart-content__quantity")!.innerHTML = String(cart.cartProducts.length);
    }
}
