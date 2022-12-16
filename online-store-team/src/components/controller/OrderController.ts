import OrderView from "../view/Order/order";
import BaseController from "./BaseController";

export default class OrderController extends BaseController {
    private orderView: OrderView;
    constructor() {
        super();
        this.orderView = new OrderView();
    }
    public override init(): void {
        this.orderView.drawOrder();
    }
}
