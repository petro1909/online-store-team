import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";

export default class StoreView {
    public drawStore(): void {
        this.drawFilter();
        this.drawProducts();
    }
    private drawProducts() {
        document.getElementById("root")!.innerHTML = storeHtml;
    }

    private drawFilter() {
        document.getElementById("root")!.innerHTML = filterHtml;
    }
}
