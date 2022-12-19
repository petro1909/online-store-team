import "./header.css";
import HeaderHtml from "./header.html";
import Cart from "../../model/Cart"; 

export default class HeaderView {
    public drawHeader(cart: Cart): void {
        document.getElementById("header")!.innerHTML = HeaderHtml;
    }
}
