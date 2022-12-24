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
        let cartOptions: ICartOptions = { page: 1, limit: 3 };
        if (options) {
            cartOptions = this.getCartOptions(options);
        }
        this.cartView.drawCart(cartOptions);
    }

    private getCartOptions(options: string): ICartOptions {
        const cartOptions: ICartOptions = {};
        options = options.slice(1);

        const optionsArr = options.split("&");
        for (const option of optionsArr) {
            const [key, value] = option.split("=");
            if (key && value) {
                cartOptions[key as keyof ICartOptions] = Number.parseInt(value);
            }
        }
        return cartOptions;
    }
}
