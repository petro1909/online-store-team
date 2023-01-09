import CartController from "../../../src/components/controller/CartController";
import ControllerFactory from "../../../src/components/controller/ControllerFactory";
import ErrorController from "../../../src/components/controller/ErrorController";
import ProductController from "../../../src/components/controller/ProductController";
import StoreController from "../../../src/components/controller/StoreController";
jest.mock("../../../src");
jest.mock("../../../src/components/app/App");
describe("test controller factory initController method", () => {
    it("returns store controller", () => {
        const routeString = "store";
        const actualController = ControllerFactory.initController(routeString);
        expect(actualController instanceof StoreController).toBeTruthy();
    });
    it("returns cart controller", () => {
        const routeString = "cart";
        const actualController = ControllerFactory.initController(routeString);
        expect(actualController instanceof CartController).toBeTruthy();
    });
    it("returns product controller", () => {
        const routeString = "product";
        const actualController = ControllerFactory.initController(routeString);
        expect(actualController instanceof ProductController).toBeTruthy();
    });
    it("returns error controller", () => {
        const routeString = "something_wrong";
        const actualController = ControllerFactory.initController(routeString);
        expect(actualController instanceof ErrorController).toBeTruthy();
    });
});
