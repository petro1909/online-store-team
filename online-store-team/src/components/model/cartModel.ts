import { CartProduct } from "./type/cartProduct";
import { CartOptions } from "./storeOptions";
import { Product } from "./type/product";
import { IPromocode } from "./type/promocode";

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
        this.getCartFromLocalStorage();
    }

    public getCartFromLocalStorage(): void {
        const cartStr = localStorage.getItem(Cart.localStorageKey);
        if (cartStr) {
            const cart = JSON.parse(cartStr) as Cart;
            this.totalCount = cart.totalCount;
            this.totalPrice = cart.totalPrice;
            this.actualPrice = cart.actualPrice;
            this.totalDiscount = cart.totalDiscount;
            this.cartProducts = cart.cartProducts;
            this.usedPromocodes = cart.usedPromocodes;
        }
    }

    public saveToLocalStorage() {
        localStorage.setItem(Cart.localStorageKey, JSON.stringify(this));
    }
    public isProductInCart(productId: number): boolean {
        const cartProduct = this.cartProducts.find((item) => item.product.id === productId);
        return !!cartProduct;
    }

    public putProductIntoCart(product: Product): boolean {
        if (this.isProductInCart(product.id)) {
            return false;
        }
        const cartProduct = {
            product: product,
            count: 1,
            totalPrice: product.price,
            cartIndex: this.cartProducts.length + 1,
        };
        this.cartProducts.push(cartProduct);
        this.totalPrice += product.price;
        this.totalCount += 1;
        this.updateActualPrice();
        this.saveToLocalStorage();
        return true;
    }

    public dropProductFromCart(productId: number): boolean {
        const cartProduct = this.cartProducts.find((item) => item.product.id === productId);
        if (!cartProduct) {
            return false;
        }
        this.totalCount -= cartProduct.count;
        this.totalPrice -= cartProduct.product.price * cartProduct.count;
        cartProduct.count = 0;
        const cartProductIndex = this.cartProducts.indexOf(cartProduct);
        this.cartProducts.splice(cartProductIndex, 1);
        this.cartProducts.map((cartProduct, index) => {
            if (index >= cartProductIndex) {
                cartProduct.cartIndex--;
            }
        });
        this.updateActualPrice();
        this.saveToLocalStorage();
        return true;
    }

    public increaceCartProductCount(cartProductId: number): boolean {
        const cartProduct = this.cartProducts.find((item) => item.product.id === cartProductId);
        if (!cartProduct || cartProduct.count >= cartProduct.product.stock) {
            return false;
        }
        cartProduct.count += 1;
        cartProduct.totalPrice += cartProduct.product.price;
        this.totalPrice += cartProduct.product.price;
        this.totalCount += 1;
        this.updateActualPrice();
        this.saveToLocalStorage();
        return true;
    }

    public decreaceCartProductCount(cartProductId: number): boolean {
        const cartProduct = this.cartProducts.find((item) => item.product.id === cartProductId);
        if (!cartProduct) {
            return false;
        }
        cartProduct.count -= 1;
        cartProduct.totalPrice -= cartProduct.product.price;
        this.totalPrice -= cartProduct.product.price;
        this.totalCount -= 1;
        if (cartProduct.count === 0) {
            const cartProductIndex = this.cartProducts.indexOf(cartProduct);
            this.cartProducts.splice(cartProductIndex, 1);
            this.cartProducts.map((cartProduct, index) => {
                if (index >= cartProductIndex) {
                    cartProduct.cartIndex--;
                }
            });
        }
        this.updateActualPrice();
        this.saveToLocalStorage();
        return true;
    }

    public updateCartProducts(options: CartOptions): Array<CartProduct> {
        options = this.validateCartOptions(options);
        const startSlice = options.limit * (options.page - 1);
        const endSlice = startSlice + options.limit;
        return this.cartProducts.slice(startSlice, endSlice);
    }

    public validateCartOptions(options: CartOptions): CartOptions {
        if (options.limit < 1 || options.page < 1) {
            options = new CartOptions();
        }
        const pagesCount = Math.ceil(this.cartProducts.length / options.limit);
        if (options.page > pagesCount) options.page = pagesCount;
        return options;
    }

    public resetCart(): void {
        this.totalCount = 0;
        this.totalPrice = 0;
        this.actualPrice = 0;
        this.totalDiscount = 0;
        this.cartProducts = [];
        this.usedPromocodes = [];
        this.saveToLocalStorage();
    }

    public setPromocode(promocodeId: string): IPromocode | undefined {
        const findedPromocode = Cart.promocodes.find((promocode) => promocodeId === promocode.text);
        if (!findedPromocode) {
            return;
        }
        if (this.usedPromocodes.includes(findedPromocode)) {
            return;
        }
        this.usedPromocodes.push(findedPromocode);
        this.totalDiscount = this.usedPromocodes.reduce((sum, promocode) => sum + promocode.discount, 0);
        this.updateActualPrice();
        this.saveToLocalStorage();
        return findedPromocode;
    }

    public removePromocode(promocodeText: string): IPromocode | undefined {
        const findedPromocode = this.usedPromocodes.find((item) => item.text === promocodeText);
        if (!findedPromocode) {
            return undefined;
        }
        const findexPromocodeIndex = this.usedPromocodes.indexOf(findedPromocode);
        this.usedPromocodes.splice(findexPromocodeIndex, 1);
        this.totalDiscount = this.usedPromocodes.reduce((sum, promocode) => sum + promocode.discount, 0);
        this.updateActualPrice();
        this.saveToLocalStorage();
        return findedPromocode;
    }

    private updateActualPrice() {
        this.actualPrice = Number((this.totalPrice * (1 - this.totalDiscount / 100)).toFixed(2));
    }
}
