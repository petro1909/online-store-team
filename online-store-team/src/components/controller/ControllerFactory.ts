import BaseController from "./baseController";
import CartController from "./cartController";
import ErrorController from "./ErrorController";
import ProductController from "./productController";
import StoreController from "./storeController";

export default class ControllerFactory {
    public static initController(route: string): BaseController {
        switch (route) {
            case "store":
                return new StoreController();
            case "cart":
                return new CartController();
            case "product":
                return new ProductController();
            default:
                return new ErrorController();
        }
    }
}
