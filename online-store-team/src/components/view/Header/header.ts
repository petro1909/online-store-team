import "./header.css";
import HeaderHtml from "./header.html";
import Cart from "../../model/Cart";
import {CartProduct} from "../../model/type/ICartProduct";

export default class HeaderView {
    public drawHeader(cart: Cart): void {
        document.getElementById("header")!.innerHTML = HeaderHtml;
        document.querySelector(".cart-total__cost")!.innerHTML  = String(cart.totalPrice);
        const productItemsQuantity = cart.cartProducts.reduce<number>((acc, item: CartProduct): number => {
            return acc + item.count;
        }, 0)
        document.querySelector(".cart-content__quantity")!.innerHTML  = String(productItemsQuantity);
    }
}
