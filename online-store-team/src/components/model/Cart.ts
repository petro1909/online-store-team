import { app } from "../..";
import { CartProduct } from "./type/ICartProduct";
import { CartOptions } from "./type/IFilterOptions";
import { Product } from "./type/IProduct";
import { IPromocode } from "./type/IPromocode";

export default class Cart {
    public totalPrice: number;
    public actualPrice: number;
    public totalCount: number;
    public totalDiscount: number;
    public cartProducts: Array<CartProduct> = [];
    public usedPromocodes: Array<IPromocode> = [];
    private static localStorageKey = "CART_54013ba69c196820e56801f1ef5aad54";
    public static promocodes: Array<IPromocode> = [
        { text: "rss_1", discount: 10 },
        { text: "rss_2", discount: 20 },
        { text: "rss_3", discount: 5 },
        { text: "rss_4", discount: 55 },
    ];

    constructor() {
        this.totalCount = 0;
        this.totalPrice = 0;
        this.actualPrice = 0;
        this.totalDiscount = 0;
        this.cartProducts = [];
        this.getCartFromLocalStorage();
    }

    private getCartFromLocalStorage(): void {
        const cartStr = localStorage.getItem(Cart.localStorageKey);
        if (cartStr) {
            const cart = JSON.parse(cartStr) as Cart;
            this.totalCount = cart.totalCount;
            this.totalPrice = cart.totalPrice;
            this.actualPrice = cart.totalPrice;
            this.totalDiscount = cart.totalDiscount;
            this.cartProducts = cart.cartProducts;
        }
    }

    public saveToLocalStorage() {
        localStorage.setItem(Cart.localStorageKey, JSON.stringify(this));
    }
    public isProductInCart(productId: number): boolean {
        const cartProduct = this.cartProducts.find((item) => item.product.id === productId);
        return !!cartProduct;
    }

    public putProductIntoCart(product: Product): void {
        const cartProduct: CartProduct = { product: product, count: 1, totalPrice: product.price };
        this.cartProducts.push(cartProduct);
        this.totalPrice += product.price;
        this.totalCount += 1;
        this.updateActualPrice();
        this.saveToLocalStorage();
    }

    public dropProductIntoCart(productId: number): void {
        const cartProduct = this.cartProducts.find((item) => item.product.id === productId);
        if (cartProduct) {
            this.totalCount -= cartProduct.count;
            this.totalPrice -= cartProduct.product.price * cartProduct.count;
            cartProduct.count = 0;
            const cartProductIndex = this.cartProducts.indexOf(cartProduct);
            this.cartProducts.splice(cartProductIndex, 1);
            this.updateActualPrice();
            this.saveToLocalStorage();
        }
    }

    public increaceCartProductCount(cartProductId: number): void {
        const cartProduct = this.cartProducts.find((item) => item.product.id === cartProductId);
        if (cartProduct && cartProduct.count < cartProduct.product.stock) {
            cartProduct.count += 1;
            cartProduct.totalPrice += cartProduct.product.price;
            this.totalPrice += cartProduct.product.price;
            this.totalCount += 1;
            this.updateActualPrice();
            this.saveToLocalStorage();
        }
    }

    public decreaceCartProductCount(cartProductId: number): void {
        const cartProduct = this.cartProducts.find((item) => item.product.id === cartProductId);
        if (cartProduct) {
            cartProduct.count -= 1;
            cartProduct.totalPrice -= cartProduct.product.price;
            this.totalPrice -= cartProduct.product.price;
            this.totalCount -= 1;
            if (cartProduct.count === 0) {
                const cartProductIndex = this.cartProducts.indexOf(cartProduct);
                this.cartProducts.splice(cartProductIndex, 1);
            }
            this.updateActualPrice();
            this.saveToLocalStorage();
        }
    }

    public updateCartProducts(options: CartOptions): Array<CartProduct> {
        const rightPagesLimit = Math.ceil(this.cartProducts.length / options.limit);
        if (options.limit < 1) options.limit = 1;
        if (options.page < 1) options.page = 1;
        if (options.page > rightPagesLimit) options.page = rightPagesLimit;
        app.router.addQueryParameters(options);
        return this.cartProducts.slice(options.limit * (options.page - 1));
    }

    public resetCart(): void {
        this.totalCount = 0;
        this.totalPrice = 0;
        this.cartProducts = [];
        localStorage.removeItem(Cart.localStorageKey);
    }

    public setPromocode(promocode: IPromocode): void {
        this.usedPromocodes.push(promocode);
        this.totalDiscount = this.usedPromocodes.reduce((sum, promocode) => sum + promocode.discount, 0);
        this.updateActualPrice();
        this.saveToLocalStorage();
    }

    public removePromocode(promocodeText: string): void {
        const findedPromocode = this.usedPromocodes.find((item) => item.text === promocodeText);
        if (findedPromocode) {
            const findexPromocodeIndex = this.usedPromocodes.indexOf(findedPromocode);
            this.usedPromocodes.slice(findexPromocodeIndex, 1);
            this.totalDiscount = this.usedPromocodes.reduce((sum, promocode) => sum + promocode.discount, 0);
            this.updateActualPrice();
            this.saveToLocalStorage();
        }
    }

    private updateActualPrice() {
        console.log(this.actualPrice);
        this.actualPrice = this.totalPrice * (1 - this.totalDiscount / 100);
    }
}
