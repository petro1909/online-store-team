import ProductView from "../view/Product/product";
import BaseController from "./BaseController";

export default class ProductController extends BaseController {
    private productView: ProductView;
    constructor() {
        super();
        this.productView = new ProductView();
    }
    public override init(): void {
        this.productView.drawProduct();
    }
}
