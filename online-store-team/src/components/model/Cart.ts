import { CartProduct } from "./type/ICartProduct";
import { Product } from "./type/IProduct";
import { IPromocode } from "./type/IPromocode";

export default class Cart {
    public totalPrice: number;
    public totalCount: number;
    public cartProducts: Array<CartProduct>;
    public promocode: IPromocode | undefined;

    constructor() {
        this.totalPrice = 0;
        this.totalCount = 0;
        this.cartProducts = [];
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

    public saveToLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(this));
    }
}
