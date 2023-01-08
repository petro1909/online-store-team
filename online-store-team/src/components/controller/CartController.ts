import { CartOptions } from "../model/storeOptions";
import CartView from "../view/cartView/cart";
import BaseController from "./BaseController";

export default class CartController extends BaseController {
    private cartView: CartView;
    constructor() {
        super();
        this.cartView = new CartView();
    }
    public override async init(options?: string): Promise<void> {
        let cartOptions: CartOptions = new CartOptions();
        if (options) {
            cartOptions = this.getCartOptions(options);
        }
        this.cartView.drawCart(cartOptions);
    }

    public getCartOptions(queryString: string): CartOptions {
        const cartOptions: CartOptions = new CartOptions();
        queryString = queryString.slice(1);
        const optionsArr = queryString.split("&");
        for (const option of optionsArr) {
            const [key, value] = option.split("=");
            if (key && value) {
                const numberValue = Number.parseInt(value);
                if (key === "page" && numberValue) {
                    cartOptions.page = numberValue;
                }
                if (key === "limit" && numberValue) {
                    cartOptions.limit = numberValue;
                }
            }
            // if (key && value) {
            //     console.log("key =", key);
            //     console.log("value =", value);
            //     if (
            //         Object.prototype.hasOwnProperty.call(cartOptions, key) &&
            //         typeof cartOptions[key as keyof typeof cartOptions] !== "function"
            //     ) {
            //         const keyType = cartOptions[key as keyof typeof cartOptions];
            //         if (typeof keyType === "number") {
            //             cartOptions[key as keyof typeof cartOptions] = Number(value);
            //         } else {
            //             cartOptions[key as keyof CartOptions] = value as never;
            //         }
            //     }
            // }
        }
        return cartOptions;
    }
}
