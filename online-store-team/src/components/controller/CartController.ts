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
        const cart = this.getCartFromLocalStorage();
        let page: number;
        if (options) {
            page = this.getCartPage(options);
        } else {
            page = 1;
        }
        this.cartView.drawCart(cart, page);
    }

    private getCartFromLocalStorage(): Cart {
        const cartStr = localStorage.getItem("cart");
        let cart: Cart;
        if (cartStr) {
            cart = JSON.parse(cartStr) as Cart;
        } else {
            cart = new Cart();
        }
        return cart;
    }

    private getCartPage(options: string): number {
        return 1;
    }
}
