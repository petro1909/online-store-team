import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";
import { Product } from "../../model/type/IProduct";
import Cart from "../../model/Cart";
import { app } from "../../..";
import { Store } from "../../model/Store";
import { IBaseOptions, IFilterOptions } from "../../model/type/IFilterOptions";

export default class StoreView {
    private cart: Cart;
    private store: Store;
    constructor(store: Store) {
        this.store = store;
        this.cart = app.Cart;
    }
    public drawStore(store, storeOptons: IFilterOptions, searchOptions: ): void {
        this.drawFilter();
        this.drawProducts(products);
    }
    private drawProducts(products: Array<Product>) {
        console.log(products);
        document.getElementById("root")!.innerHTML = products;
    }

    private drawFilter(filterOptions:  ) {
        document.getElementById("root")!.innerHTML = filterHtml;
    }

    private toggleCartProduct(id: number) {
      if (this.cart.hasProduct(id)) {
        this.cart.dropProductIntoCart();
      } else {
        this.cart.putProductIntoCart();

      }
    }
}
