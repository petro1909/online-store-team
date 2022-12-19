import { Store } from "../model/Store";
import ProductView from "../view/Product/product";
import BaseController from "./BaseController";
import App from "../app/App";

export default class ProductController extends BaseController {
    private productView: ProductView;
    private store: Store;
    constructor() {
        super();
        this.productView = new ProductView();
        this.store = App.store;
    }
    public override async init(options?: string): Promise<void> {
        let productId: number;
        if (options) {
            productId = this.getProductId(options);
        }
        let product = this.store.products.find((item) => item.id === productId);
        this.productView.drawProduct(product);
    }
    private getProductId(options: string): number {
    }
}
