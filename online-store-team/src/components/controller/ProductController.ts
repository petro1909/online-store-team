import { Store } from "../model/Store";
import ProductView from "../view/Product/product";
import BaseController from "./BaseController";
import { app } from "../..";
import Cart from "../model/Cart";

export default class ProductController extends BaseController {
    private productView: ProductView;
    private store: Store;
    private cart: Cart;
    constructor() {
        super();
        this.productView = new ProductView();
        this.store = app.store;
        this.cart = app.cart;
    }
    public override async init(options?: string): Promise<void> {
        let productId: number;
        if (options) {
            productId = this.getProductId(options);
        }
        const product = this.store.products.find((item) => item.id === productId);
        if (product) {
            await this.productView.drawProduct(product, this.cart); // ! add ! operator to product
        }
    }
    private getProductId(options: string): number {
        return Number.parseInt(options);
    }
}
