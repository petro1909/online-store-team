import ErrorView from "../view/Error/error";
import BaseController from "./BaseController";

export default class ErrorController extends BaseController {
    private errorView: ErrorView;
    constructor() {
        super();
        this.errorView = new ErrorView();
    }
    public override init(): void {
        this.errorView.drawError();
    }
}
