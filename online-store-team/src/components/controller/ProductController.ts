import ProductView from "../view/Product/product";
import BaseController from "./baseController";
import { app } from "../..";

export default class ProductController extends BaseController {
    private productView: ProductView;
    constructor() {
        super();
        this.productView = new ProductView();
    }
    public override async init(options?: string): Promise<void> {
        if (!options) {
            app.router.route("/error");
        } else {
            const productId = this.getProductId(options);
            if (!productId) {
                app.router.route("/error");
            } else {
                await this.productView.drawProduct(productId);
            }
        }
    }
    private getProductId(options: string): number | undefined {
        return Number.parseInt(options);
    }
}
