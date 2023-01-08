import CartController from "../../../src/components/controller/cartController";

const cartController = new CartController();
const testQueryString = "?page=1&limit=3"

describe("test cart controller getCartOptions method", () => {
    it("returns right cart options after parsing query string", () => {
        const expected = {page: 1, limit: 3};
        const result = cartController.getCartOptions(testQueryString);
        expect(result).toEqual(expected);
    });
});