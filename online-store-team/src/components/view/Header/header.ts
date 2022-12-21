import { app } from "../../..";
import Cart from "../../model/Cart";
import "./header.css";
import HeaderHtml from "./header.html";

export default class HeaderView {
    public drawHeader(cart: Cart): void {
        document.getElementById("header")!.innerHTML = HeaderHtml;
        document.querySelector(".cart-content__quantity")!.innerHTML = `${cart.totalCount}`;
        //document.querySelectorAll('[href^="/"]').forEach((a) => a.addEventListener("click", app.router.route));
    }
}
