import CartController from "../../../src/components/controller/CartController";
import { CartOptions } from "../../../src/components/model/storeOptions";
jest.mock("../../../src");
jest.mock("../../../src/components/app/App");
const cartController = new CartController();
describe("test cart controller getCartOptions method", () => {
    it("returns right cart options after parsing query string", () => {
        let queryString = "?page=3&limit=1";
        let expected: CartOptions = { page: 3, limit: 1 };
        let result = cartController.getCartOptions(queryString);
        expect(result).toEqual(expected);

        queryString = "?page=1&limit=10categories=2maxPrice=-1";
        expected = { page: 1, limit: 10 };
        result = cartController.getCartOptions(queryString);
        expect(result).toEqual(expected);

        queryString = "?page=error&limit=5";
        expected = { page: 1, limit: 5 };
        result = cartController.getCartOptions(queryString);
        expect(result).toEqual(expected);
    });
});
