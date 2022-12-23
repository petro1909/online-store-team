import { app } from "../..";
import Cart from "../model/Cart";
import { ICartOptions } from "../model/type/IFilterOptions";
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

    private getCartPage(options: string): ICartOptions {
        const cartOptions: ICartOptions = { page: 1, limit: 3 };
        options = options.slice(1);
        console.log(options);

        const optionsArr = options.split("&");
        console.log(options);
        //const cartOptions;
    }
}
