/* eslint-disable @typescript-eslint/no-non-null-assertion */
import StoreFilter from "../../../src/components/model/storeFilterModel";
import Store from "../../../src/components/model/storeModel";
import { StoreFilterOptions } from "../../../src/components/model/storeOptions";
// import { Product } from "../../../src/components/model/type/product";
import {
    testProducts,
    testProduct_1,
    testProduct_2,
    testProduct_3,
    testProduct_4,
    testProduct_5,
    testProduct_6,
} from "../../testFiles";

const testStore: Store = new Store();
testStore.products = testProducts;
const testFilterOptions: StoreFilterOptions = new StoreFilterOptions();

testStore.filter = new StoreFilter(testStore.products);
describe("test testStore model functions", () => {
    describe("test filterProducts", () => {
        it("return filtered products depends on store filter options", () => {
            testFilterOptions.categories.push("laptops");
            const expected = [testProduct_6];
            const result = testStore.filter.filterProducts(testProducts, testFilterOptions);
            expect(result).toEqual(expected);
        });
    });
    describe("test sortProducts", () => {
        it("return products in right order depends on store filter sort options", () => {
            testFilterOptions.sortingString = "price-ASC";
            const expected = [testProduct_4, testProduct_5, testProduct_1, testProduct_2, testProduct_3, testProduct_6];
            const result = testStore.filter.sortProducts(testProducts, testFilterOptions);
            expect(result).toEqual(expected);
        });
    });
    describe("test searchProducts", () => {
        it("return searched products depends on store filter search options", () => {
            testFilterOptions.searchString = "app";
            const expected = [testProduct_1, testProduct_2, testProduct_6];
            const result = testStore.filter.searchProducts(testProducts, testFilterOptions);
            expect(result).toEqual(expected);
        });
    });
});
