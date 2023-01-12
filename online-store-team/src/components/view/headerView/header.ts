import "./header.css";
import HeaderHtml from "./header.html";
import Cart from "../../model/cartModel";
import Utils from "../common/utils";

export default class HeaderView {
    public drawHeader(cart: Cart): void {
        const header = document.getElementById("header") as HTMLElement | null;
        if (!header) {
            return;
        }
        header.innerHTML = HeaderHtml;
        Utils.setElementInnerHtml(header, ".cart-total__cost", `${cart.totalPrice}`);
        Utils.setElementInnerHtml(header, ".cart-content__quantity", `${cart.totalCount}`);
    }
}
