import Router from "../../../src/components/router/router";

const testRouter = new Router();

// const stubLocalCartWindowLocation = {
//     "href": "http://localhost:8080/cart?page=1&limit=3",
//     "pathname": "/cart",
//     "search": "?page=1&limit=3",
// }

// const stubDeployCartWindowLocation = {
//     "href": "https://petro1909-online-store-team.netlify.app/cart?page=1&limit=3",
//     "pathname": "/cart",
//     "search": "?page=1&limit=3",
// }

// const stubLocalStoreWindowLocation = {
//     "href": "http://localhost:8080/?categories=smartphones&brands=Apple&minPrice=10&maxPrice=1749",
//     "pathname": "/",
//     "search": "?categories=smartphones&brands=Apple&minPrice=10&maxPrice=1749",
// }

// const stubDeployStoreWindowLocation = {
//     "href": "https://petro1909-online-store-team.netlify.app/?categories=smartphones&brands=Apple&minPrice=10&maxPrice=1749",
//     "pathname": "/",
//     "search": "?categories=smartphones&brands=Apple&minPrice=10&maxPrice=1749",
// }

const stubStoreFilterOptions = {
    "categories": [
        "smartphones"
    ],
    "brands": [
        "Apple"
    ],
    "minPrice": 0,
    "maxPrice": 0,
    "minStock": 0,
    "maxStock": 0,
    "searchString": "",
    "displayMode": "",
    "sortingString": ""
}

const stubCartOptions = {
    "page": 1,
    "limit": 3
}

describe("test router model functions", () => {
    describe("test getWindowPathString method", () => {
        it("returns right tuple executing mathod depends on window.location", () => {
            //
        });
    });
    describe("test parseQueryParameters method", () => {
        it("returns right path string depends on StoreFilterOptions", () => {
            const expected = "/?categories=smartphones&brands=Apple";
            const result = testRouter.parseQueryParameters(stubStoreFilterOptions);
            expect(result).toEqual(expected);
        });
        it("returns right path string depends on CartOptions", () => {
            const expected = "/cart?page=1&limit=3";
            const result = testRouter.parseQueryParameters(stubCartOptions);
            expect(result).toEqual(expected);
        });
    });
});