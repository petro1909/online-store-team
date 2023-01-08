import ErrorView from "../view/errorView/error";
import BaseController from "./BaseController";

export default class ErrorController extends BaseController {
    private errorView: ErrorView;
    constructor() {
        super();
        this.errorView = new ErrorView();
    }
    public override async init(options?: string): Promise<void> {
        console.log(options);
        this.errorView.drawError();
    }
}
