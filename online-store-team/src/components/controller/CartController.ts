import { app } from "../..";
import Cart from "../model/Cart";
import CartView from "../view/Cart/cart";
import BaseController from "./BaseController";

export default class CartController extends BaseController {
    private cartView: CartView;
    constructor() {
        super();
        this.cartView = new CartView();
    }
    public override async init(options?: string): Promise<void> {
        let page: number;
        if (options) {
            page = this.getCartPage(options);
        } else {
            page = 1;
        }
        this.cartView.drawCart(app.cart, page);
    }

    private getCartPage(options: string): number {
        return 1;
    }
}
