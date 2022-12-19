export default class Cart {
    public totalPrice: number;
    public cartProducts: Array<CartProduct>;
    public promocode: IPromocode | undefined;

    constructor() {
        this.totalPrice = 0;
        this.cartProducts = [];
    }

    public putProductIntoCart(product: Product): void {
        const cartProduct: CartProduct = { product: product, count: 1, totalPrice: product.price };
        this.cartProducts.push(cartProduct);
        this.totalPrice += product.price;
    }

    public increaceCartProductCount(cartProductId: number): void {
        const cartProduct = this.cartProducts.find((item) => item.product.id === cartProductId);
        if (cartProduct && cartProduct.count < cartProduct.product.stock) {
            cartProduct.count += 1;
            cartProduct.totalPrice += cartProduct.product.price;
            this.totalPrice += cartProduct.product.price;
        }
    }

    public decreaceCartProductCount(cartProductId: number): void {
        const cartProduct = this.cartProducts.find((item) => item.product.id === cartProductId);
        if (cartProduct) {
            cartProduct.count -= 1;
            cartProduct.totalPrice -= cartProduct.product.price;
            this.totalPrice -= cartProduct.product.price;
            if (cartProduct.count === 0) {
                const cartProductIndex = this.cartProducts.indexOf(cartProduct);
                this.cartProducts.splice(cartProductIndex, 1);
            }
        }
    }

    public setPromocode(promocode: IPromocode) {
        this.totalPrice = this.totalPrice * (1 - promocode.discount / 100);
    }
}
