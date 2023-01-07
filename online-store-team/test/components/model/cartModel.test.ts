import Cart from "../../../src/components/model/cartModel";
import { CartOptions } from "../../../src/components/model/storeOptions";
import { CartProduct } from "../../../src/components/model/type/cartProduct";
import { Product } from "../../../src/components/model/type/product";
import { IPromocode } from "../../../src/components/model/type/promocode";
import { products } from "../../testFiles";

Cart.prototype.getCartFromLocalStorage = jest.fn().mockImplementation(() => undefined);
Cart.prototype.saveToLocalStorage = jest.fn().mockImplementation(() => undefined);
const testCart: Cart = new Cart();

beforeAll(() => {
    products.forEach((product, index) => {
        const cartProduct: CartProduct = {
            product: product,
            count: 1,
            totalPrice: product.price,
            cartIndex: index + 1,
        };
        testCart.cartProducts.push(cartProduct);
    });
    testCart.usedPromocodes.push({ text: "rss_1", discount: 10 }, { text: "rss_2", discount: 20 });
});

describe("test testCart model functions", () => {
    describe("test isProductInCartMethod", () => {
        it("returns true if product with passed id is in testCart", () => {
            const expected = true;

            let actual = testCart.isProductInCart(1);
            expect(actual).toEqual(expected);
            actual = testCart.isProductInCart(2);
            expect(actual).toEqual(expected);
            actual = testCart.isProductInCart(3);
            expect(actual).toEqual(expected);
        });
        it("returns false if product with passed id is not in testCart", () => {
            const expected = false;

            let actual = testCart.isProductInCart(-1);
            expect(actual).toEqual(expected);
            actual = testCart.isProductInCart(1000);
            expect(actual).toEqual(expected);
        });
    });
    describe("test putProductIntoCart", () => {
        const testedProduct: Product = {
            id: 100,
            title: "iPhone 9",
            description: "An apple mobile which is nothing like apple",
            price: 549,
            discountPercentage: 12.96,
            rating: 4.69,
            stock: 94,
            brand: "Apple",
            category: "smartphones",
            thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
            images: [
                "https://i.dummyjson.com/data/products/1/1.jpg",
                "https://i.dummyjson.com/data/products/1/2.jpg",
                "https://i.dummyjson.com/data/products/1/3.jpg",
                "https://i.dummyjson.com/data/products/1/4.jpg",
                "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
            ],
        };
        it("put product into testCart and return true if passed product is not in testCart", () => {
            const expected = true;
            const push = jest.spyOn(Array.prototype, "push").mockClear();

            const actual = testCart.putProductIntoCart(testedProduct);

            expect(actual).toEqual(expected);
            expect(testCart.isProductInCart(testedProduct.id)).toBe(true);
            expect(push).toBeCalledTimes(1);
        });
        it("don't put product into testCart and returns false if passed product is already in testCart", () => {
            const expected = false;
            const push = jest.spyOn(Array.prototype, "push").mockClear();

            const actual = testCart.putProductIntoCart(testedProduct);

            expect(actual).toEqual(expected);
            expect(testCart.isProductInCart(testedProduct.id)).toBe(true);
            expect(push).toBeCalledTimes(0);
        });
    });
    describe("test dropProductFromCart", () => {
        const productId = 100;
        it("drop product testCart and return true if product with passed product id is in testCart", () => {
            const expected = true;
            const splice = jest.spyOn(Array.prototype, "splice").mockClear();

            const actual = testCart.dropProductIntoCart(productId);

            expect(actual).toEqual(expected);
            expect(testCart.isProductInCart(productId)).toBe(false);
            expect(splice).toBeCalledTimes(1);
        });
        it("returns false if product with passed product id is not in testCart", () => {
            const expected = false;
            expect(testCart.isProductInCart(productId)).toBe(false);
            const splice = jest.spyOn(Array.prototype, "splice").mockClear();

            const actual = testCart.dropProductIntoCart(productId);

            expect(actual).toEqual(expected);
            expect(splice).toBeCalledTimes(0);
        });
    });
    describe("test increaseCartProductCount method", () => {
        it("return true if product with passed product id is in testCart", () => {
            const productId = 1;
            const expected = true;
            const cartTotalCount = testCart.totalCount;
            const cartTotalPrice = testCart.totalPrice;

            const actual = testCart.increaceCartProductCount(productId);
            expect(actual).toEqual(expected);
            expect(testCart.totalCount).toBe(cartTotalCount + 1);
            expect(testCart.totalPrice).toBeGreaterThan(cartTotalPrice);
        });
        it("returns false if product with passed product id is not in testCart", () => {
            const productId = 200;
            const expected = false;
            expect(testCart.isProductInCart(productId)).toBe(false);
            const cartTotalCount = testCart.totalCount;
            const cartTotalPrice = testCart.totalPrice;

            const actual = testCart.increaceCartProductCount(productId);
            expect(actual).toEqual(expected);
            expect(testCart.totalCount).toEqual(cartTotalCount);
            expect(testCart.totalPrice).toEqual(cartTotalPrice);
        });
        it("returns false if product count in stock with passed product id is less or equal then cart product count", () => {
            const productId = 1;
            expect(testCart.isProductInCart(productId)).toBe(true);
            const cartProudct = testCart.cartProducts.find((product) => product.product.id === productId);
            if (cartProudct) {
                cartProudct.count = cartProudct.product.stock;
            }
            const expected = false;

            const cartTotalCount = testCart.totalCount;
            const cartTotalPrice = testCart.totalPrice;

            const actual = testCart.increaceCartProductCount(productId);
            expect(actual).toEqual(expected);
            expect(testCart.totalCount).toEqual(cartTotalCount);
            expect(testCart.totalPrice).toEqual(cartTotalPrice);
        });
    });
    describe("test decreaseCartProductCount method", () => {
        it("return true if product with passed product id is in testCart", () => {
            const productId = 1;
            const expected = true;
            const cartTotalCount = testCart.totalCount;
            const cartTotalPrice = testCart.totalPrice;

            const actual = testCart.decreaceCartProductCount(productId);
            expect(actual).toEqual(expected);
            expect(testCart.totalCount).toBe(cartTotalCount - 1);
            expect(testCart.totalPrice).toBeLessThan(cartTotalPrice);
        });
        it("returns true and frop product from cart if cart product count is 1", () => {
            const productId = 1;
            expect(testCart.isProductInCart(productId)).toBe(true);
            const cartProudct = testCart.cartProducts.find((product) => product.product.id === productId);
            if (cartProudct) {
                cartProudct.count = 1;
            }
            const expected = true;

            const cartTotalCount = testCart.totalCount;
            const cartTotalPrice = testCart.totalPrice;

            const actual = testCart.decreaceCartProductCount(productId);
            expect(actual).toEqual(expected);
            expect(testCart.totalCount).toBe(cartTotalCount - 1);
            expect(testCart.totalPrice).toBeLessThan(cartTotalPrice);
            expect(testCart.isProductInCart(productId)).toBe(false);
        });
        it("returns false if product with passed product id is not in testCart", () => {
            const productId = 200;
            const expected = false;
            expect(testCart.isProductInCart(productId)).toBe(false);
            const cartTotalCount = testCart.totalCount;
            const cartTotalPrice = testCart.totalPrice;

            const actual = testCart.decreaceCartProductCount(productId);
            expect(actual).toEqual(expected);
            expect(testCart.totalCount).toEqual(cartTotalCount);
            expect(testCart.totalPrice).toEqual(cartTotalPrice);
        });
    });
    describe("test validateCartOptions", () => {
        it("return passed testCart options if testCart options is valid", () => {
            const inputOptions: CartOptions = { page: 2, limit: 2 };
            const result = testCart.validateCartOptions(inputOptions);
            expect(inputOptions).toEqual(result);
        });
        it("return default testCart options if testCart options is invalid", () => {
            const expectedOutputOptions: CartOptions = new CartOptions();
            let inputOptions: CartOptions = { page: -1, limit: 2 };

            let result = testCart.validateCartOptions(inputOptions);
            expect(expectedOutputOptions).toEqual(result);

            inputOptions = { page: 1, limit: -3 };

            result = testCart.validateCartOptions(inputOptions);
            expect(expectedOutputOptions).toEqual(result);
        });
        it("return testCart options with page 1 if passed testCart options page is more then testCart page count", () => {
            const inputOptions: CartOptions = { page: 200, limit: 2 };
            const expectedOutputOptions: CartOptions = { page: 1, limit: 2 };
            const result = testCart.validateCartOptions(inputOptions);
            expect(expectedOutputOptions).toEqual(result);
        });
    });
    describe("test updateCartPromocode method", () => {
        it("return correct array", () => {
            const expected = testCart.cartProducts.slice(0, 3);
            const actual = testCart.updateCartProducts({ page: 1, limit: 3 });
            expect(actual).toEqual(expected);
        });
        it("return empty array if testCart products array is empty", () => {
            const expected: Array<CartProduct> = [];
            testCart.cartProducts = [];
            const actual = testCart.updateCartProducts({ page: 1, limit: 3 });
            expect(actual).toEqual(expected);
        });
    });
    describe("test setPromocode method", () => {
        const promocode: IPromocode = { text: "rss_3", discount: 5 };
        it("set promocode and return true if passed promocode is not in testCart", () => {
            const push = jest.spyOn(Array.prototype, "push").mockClear();
            const expected = true;

            const actual = testCart.setPromocode(promocode);
            expect(actual).toEqual(expected);

            expect(testCart.usedPromocodes.includes(promocode)).toBe(true);
            expect(push).toBeCalledTimes(1);
        });
        it("don't set promocode and return false if passed promocode is already in testCart", () => {
            expect(testCart.usedPromocodes.includes(promocode)).toBe(true);
            const push = jest.spyOn(Array.prototype, "push").mockClear();
            const expected = false;

            const actual = testCart.setPromocode(promocode);
            expect(actual).toEqual(expected);

            expect(push).toBeCalledTimes(0);
        });
    });
    describe("test removePromocode method", () => {
        const promocode: IPromocode = { text: "rss_1", discount: 10 };
        it("remove promocode and return true if promocode with passed promocode text is in testCart", () => {
            const splice = jest.spyOn(Array.prototype, "splice").mockClear();
            const expected = true;
            const actual = testCart.removePromocode(promocode.text);

            expect(actual).toEqual(expected);
            expect(splice).toBeCalledTimes(1);
            expect(testCart.usedPromocodes.includes(promocode)).toBe(false);
        });
        it("return false if promocode with passed promocode text is not in testCart", () => {
            const splice = jest.spyOn(Array.prototype, "splice").mockClear();
            const expected = false;

            expect(testCart.usedPromocodes.includes(promocode)).toBe(false);
            const actual = testCart.removePromocode(promocode.text);

            expect(actual).toEqual(expected);
            expect(splice).toBeCalledTimes(0);
        });
    });
    describe("test resetCart method", () => {
        it("set all number fields to zero and all array fields to empty array", () => {
            testCart.resetCart();
            for (const propKey of Object.keys(testCart)) {
                const value = testCart[propKey as keyof typeof testCart];
                if (typeof value === "number") {
                    expect(0).toEqual(value);
                } else if (Array.isArray(value)) {
                    expect([]).toEqual(value);
                }
            }
        });
    });
});
