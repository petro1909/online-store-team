import StoreController from "../../../src/components/controller/StoreController";

const storeController = new StoreController();
const testQueryString = "?categories=smartphones&brands=Apple&minPrice=10&maxPrice=1749";
const testExpected = {
    categories: [],
    brands: [],
    minPrice: 10,
    maxPrice: 1749,
    minStock: 0,
    maxStock: 0,
    searchString: "",
    displayMode: "",
    sortingString: "",
}
describe("test store controller getStoreOptions method", () => {
    it("returns right store options after parsing query string", () => {
        const expected = testExpected ;
        const result = storeController.getStoreOptions(testQueryString);
        expect(result).toEqual(expected);
    });
});
