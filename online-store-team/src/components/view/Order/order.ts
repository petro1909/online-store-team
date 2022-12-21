import orderHtml from "./order.html";
import "./order.css";

export default class OrderView {
    public drawOrder(): void {
        document.getElementById("root")!.innerHTML = orderHtml;
        document.getElementById("pop-up")!.classList.remove("pop-up_invisible");
        const order = document.getElementById("order");
        order!.addEventListener("submit", event => {
            event.preventDefault();
            document.getElementById("pop-up")!.classList.add("pop-up_invisible");
            localStorage.setItem("cart", '');
        })
    }
}
