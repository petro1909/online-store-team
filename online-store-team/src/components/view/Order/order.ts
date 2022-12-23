import orderHtml from "./order.html";
import "./order.css";

export default class OrderView {
    public drawOrder(): void {
        document.getElementById("root")!.innerHTML = orderHtml;
        document.getElementById("pop-up")!.classList.remove("pop-up_invisible");
        const order = document.getElementById("order") as HTMLFormElement;
        const popUp = document.getElementById("pop-up");
        order!.addEventListener("submit", (event) => {
            event.preventDefault();
            document.getElementById("pop-up")!.classList.add("pop-up_invisible");
            order!.reset();
            localStorage.setItem("cart", "");
        });
        popUp!.addEventListener("click", (event) => {
            const clickedElement = event.target! as HTMLDivElement;
            if (clickedElement.classList.contains("pop-up")) {
                order!.reset();
                document.getElementById("pop-up")!.classList.add("pop-up_invisible");
            }
        });
    }
}
