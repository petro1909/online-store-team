/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "./header.css";
import HeaderHtml from "./header.html";
import Cart from "../../model/Cart";
import BurgerMenuImage from "../../../assets/img/Header/burger_menu.svg";

export default class HeaderView {
    public drawHeader(cart: Cart): void {
        document.getElementById("header")!.innerHTML = HeaderHtml;
        document.querySelector(".cart-total__cost")!.innerHTML = String(cart.totalPrice);
        document.querySelector(".cart-content__quantity")!.innerHTML = String(cart.totalCount);

        const burgerMenuImage = document.querySelector(".burger-menu__img")! as HTMLImageElement;
        burgerMenuImage.src = BurgerMenuImage;
        burgerMenuImage.addEventListener("click", () => {
            const filter = document.querySelector(".filter") as HTMLElement;
            filter!.classList.add("filter-show");
        });
    }
}
