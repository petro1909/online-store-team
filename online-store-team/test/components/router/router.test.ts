import { CartOptions } from "../../../src/components/model/storeOptions";
import Router from "../../../src/components/router/router";
Router.prototype.start = jest.fn().mockImplementation(() => undefined);
Router.prototype.handleLocation = jest.fn().mockImplementation(() => undefined);
jest.mock("../../../src/components/controller/ControllerFactory", () => undefined);
// const testRouter = new Router();
//нужно замокать window.loaction, чтобы можно было использовать
//window.location.pathname и window.location.search
// interface myLocation {
//     href: string;
//     search: string;
//     pathname: string;
// }
// eslint-disable-next-line no-global-assign
const testRouter = new Router();
// const stubStoreFilterOptions: StoreFilterOptions = {
//     categories: ["smartphones"],
//     brands: ["Apple"],
//     minPrice: 0,
//     maxPrice: 0,
//     minStock: 0,
//     maxStock: 0,
//     searchString: "",
//     displayMode: "",
//     sortingString: "",
// };

const stubCartOptions: CartOptions = {
    page: 1,
    limit: 3,
};

describe("test router model functions", () => {
    describe("test getWindowPathString method", () => {
        it("returns right tuple executing mathod depends on window.location", () => {
            //
        });
    });
    describe("test parseQueryParameters method", () => {
        // it("returns right path string depends on StoreFilterOptions", () => {
        //     const expected = "/?categories=smartphones&brands=Apple";
        //     const result = testRouter.parseQueryParameters(stubStoreFilterOptions);
        //     expect(result).toEqual(expected);
        // });
        it("returns right path string depends on CartOptions", () => {
            window.location.pathname = "/cart";
            console.log(window.location.pathname);
            // const stubLocalCartWindowLocation = {
            //     href: "http://localhost:8080/cart?page=1&limit=3",
            //     pathname: "/cart",
            //     search: "?page=1&limit=3",
            // };
            // jest.mock("window.location", () => stubLocalCartWindowLocation);
            const expected = "/cart?page=1&limit=3";
            const result = testRouter.parseQueryParameters(stubCartOptions);
            expect(result).toEqual(expected);
        });
    });
});
