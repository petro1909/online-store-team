import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";

export default class StoreView {
    public drawStore(store, storeOptions): void {
        this.drawFilter();
        this.drawProducts(products);
    }
    private drawProducts(products: Array<Product>) {
        console.log(products);
        document.getElementById("root")!.innerHTML = products;
    }

    private drawFilter(storeOptions) {
        document.getElementById("root")!.innerHTML = filterHtml;
    }
}
