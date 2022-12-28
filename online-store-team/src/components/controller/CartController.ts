import { CartOptions } from "../model/type/IFilterOptions";
import CartView from "../view/Cart/cart";
import BaseController from "./BaseController";

export default class CartController extends BaseController {
    private cartView: CartView;
    constructor() {
        super();
        this.cartView = new CartView();
    }
    public override async init(options?: string): Promise<void> {
        let cartOptions: CartOptions = { page: 1, limit: 3 };
        console.log("options init=", options);
        if (options) {
            cartOptions = this.getCartOptions(options);
            console.log("cartOptions true=", cartOptions);
        }
        this.cartView.drawCart(cartOptions);
    }

    public getCartOptions(queryString: string): CartOptions {
        const cartOptions: CartOptions = new CartOptions();

        const optionsArr = queryString.split("&");
        for (const option of optionsArr) {
            let [key, value] = option.split("=");
            key = key!.replace("?", "");
            if ((key && value)) {
                console.log("key =", key);
                console.log("value =", value);
                if (
                    Object.prototype.hasOwnProperty.call(cartOptions, key) &&
                    typeof cartOptions[key as keyof typeof cartOptions] !== "function"
                ) {
                    const keyType = cartOptions[key as keyof typeof cartOptions];
                    if (typeof keyType === "number") {
                        cartOptions[key as keyof typeof cartOptions] = Number(value);
                    } else {
                        cartOptions[key as keyof CartOptions] = value as never;
                    }
                }
            }
        }
        console.log("cartOptions return=", cartOptions);
        return cartOptions;
    }
}
