/* eslint-disable @typescript-eslint/no-non-null-assertion */
import StoreFilter from "../../../src/components/model/storeFilterModel";
import Store from "../../../src/components/model/storeModel";
import { StoreFilterOptions } from "../../../src/components/model/storeOptions";
// import { Product } from "../../../src/components/model/type/product";
import { testProducts } from "../../testFiles";

const testStore: Store = new Store();
testStore.products = testProducts;
const testFilterOptions: StoreFilterOptions = new StoreFilterOptions();
testFilterOptions.searchString = "mob";

describe("test testStore model functions", () => {
    describe("test initFilter", () => {
        it("returns right filter fields after filter initialisation depend on test products", () => {
            testStore.filter = new StoreFilter(testStore.products);
            //check store filter fields
        });
    });
    describe("test updateFilter", () => {
        it("return filtered products depends on store filter options ", () => {
            //
        });
    });
    describe("test updateFilterFields", () => {
        it("return right filter fields depends on store filter options ", () => {
            //
        });
    });
    describe("test filterProduct", () => {
        it("return true if product fit passed store filter otions", () => {
            //
        });
        it("return false if product doesn't fit passed store filter otions", () => {
            //
        });
    });
    describe("test searchProduct", () => {
        it("return true if product fit passed store filter search otions", () => {
            //
            const product = testProducts[0];
            const expected = true;
            const result = testStore.filter.searchProduct(product!, testFilterOptions);
            expect(result).toEqual(expected);
        });
        it("return false if product doesn't fit passed store filter search otions", () => {
            //
        });
    });
    describe("test filterProducts", () => {
        it("return filtered products depends on store filter options", () => {
            //
        });
    });
    describe("test sortProducts", () => {
        it("return products in right order depends on store filter sort options", () => {
            //
        });
    });
    describe("test searchProducts", () => {
        it("return searched products depends on store filter search options", () => {
            //
        });
    });
});
