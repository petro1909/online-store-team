import ProductController from "../../../src/components/controller/ProductController";
jest.mock("../../../src");
jest.mock("../../../src/components/app/App");
ProductController.prototype.init = jest.fn().mockImplementation(() => undefined);
const productController = new ProductController();
describe("test product controller methods", () => {
    describe("test getProductId method", () => {
        it("returns right number after parsing options", () => {
            const inputOptions = "12";
            const expected = 12;
            const result = productController.getProductId(inputOptions);
            expect(result).toEqual(expected);
        });
        it("returns undefinded after parsing options if options doesn't number", () => {
            const inputOptions = "fewf";
            const expected = NaN;
            const result = productController.getProductId(inputOptions);
            expect(result).toEqual(expected);
        });
    });
});
