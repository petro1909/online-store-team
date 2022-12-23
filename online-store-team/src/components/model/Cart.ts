import { app } from "../..";
import { CartProduct } from "./type/ICartProduct";
import { Product } from "./type/IProduct";
import { IPromocode } from "./type/IPromocode";

export default class Cart {
    public totalPrice: number;
    public totalCount: number;
    public cartProducts: Array<CartProduct> = [];
    public promocode: IPromocode | undefined;
    private static localStorageKey: string = "CART_54013ba69c196820e56801f1ef5aad54";

    constructor() {
        this.totalCount = 0;
        this.totalPrice = 0;
        this.cartProducts = [];
        this.getCartFromLocalStorage();
    }

    private getCartFromLocalStorage(): void {
        const cartStr = localStorage.getItem(Cart.localStorageKey);
        if (cartStr) {
            const cart = JSON.parse(cartStr) as Cart;
            this.totalCount = cart.totalCount;
            this.totalPrice = cart.totalPrice;
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
            this.saveToLocalStorage();
        }
    }

    public setPromocode(promocode: IPromocode) {
        this.totalPrice = this.totalPrice * (1 - promocode.discount / 100);
        this.saveToLocalStorage();
    }
}
