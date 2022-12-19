import BaseController from "./BaseController";
import CartController from "./CartController";
import ErrorController from "./ErrorController";
import OrderController from "./OrderController";
import ProductController from "./ProductController";
import StoreController from "./StoreController";

export default class ControllerFactory {
    public static initController(route: string): BaseController {
        switch (route) {
            case "store":
                return new StoreController();
            case "cart":
                return new CartController();
            case "product":
                return new ProductController();
            case "order":
                return new OrderController();
            default:
                return new ErrorController();
        }
    }
}
