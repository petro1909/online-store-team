import orderHtml from "./order.html";
import { app } from "../../../index";
import Cart from "../../model/Cart";
import CartView from "../../view/Cart/cart";
import "./order.css";
import App from "../../app/App";

export default class OrderView {
    private static cart: Cart;
    private static cartView: CartView;
    public drawOrder(): void {
        const isPopUp = document.getElementById("pop-up");
        if (!isPopUp) {
            document.getElementById("root")!.insertAdjacentHTML("beforeend", orderHtml);
            const popUp = document.getElementById("pop-up");
            const order = document.getElementById("order") as HTMLFormElement;
            popUp!.addEventListener("click", (event) => {
                event.stopPropagation();
                console.log("click");
                const clickedElement = event.target! as HTMLDivElement;
                if (clickedElement.classList.contains("pop-up")) {
                    order!.reset();
                    popUp!.classList.add("pop-up_invisible");
                }
            });
            order!.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.preventDefault();
                document.getElementById("pop-up")!.classList.add("pop-up_invisible");
                order!.reset();
                app.cart.totalCount = 0;
                app.cart.totalPrice = 0;
                app.cart.cartProducts.length = 0;
                const view = new CartView();
                view.drawCart(app.cart, 0);
                app.header.drawHeader(app.cart);
                app.cart.saveToLocalStorage();
            });
        } else {
            const popUp = document.getElementById("pop-up");
            popUp!.classList.remove("pop-up_invisible");
        }
    }
}
