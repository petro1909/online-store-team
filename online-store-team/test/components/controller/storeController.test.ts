import StoreController from "../../../src/components/controller/StoreController";
import { StoreFilterOptions } from "../../../src/components/model/storeOptions";
jest.mock("../../../src");
jest.mock("../../../src/components/app/App");
const storeController = new StoreController();

describe("test store controller getStoreOptions method", () => {
    it("returns right store options after parsing query string", () => {
        let queryString = "?";
        let expected = new StoreFilterOptions();
        let result = storeController.getStoreOptions(queryString);
        expect(result).toEqual(expected);

        queryString = "?minPrice=123";
        expected = new StoreFilterOptions();
        expected.minPrice = 123;
        result = storeController.getStoreOptions(queryString);
        expect(result).toEqual(expected);

        queryString = "?minPrice=dwqdw";
        expected = new StoreFilterOptions();
        result = storeController.getStoreOptions(queryString);
        expect(result).toEqual(expected);

        queryString = "?minPrice=110&maxPrice=210wrongParameter=dwqd";
        expected = new StoreFilterOptions();
        expected.minPrice = 110;
        expected.maxPrice = 210;
        result = storeController.getStoreOptions(queryString);
        expect(result).toEqual(expected);

        queryString = "?categories=smartphones+skincare&minPrice=491&maxPrice=1249";
        expected = new StoreFilterOptions();
        expected.categories.push("smartphones", "skincare");
        expected.minPrice = 491;
        expected.maxPrice = 1249;
        result = storeController.getStoreOptions(queryString);
        expect(result).toEqual(expected);
    });
});
