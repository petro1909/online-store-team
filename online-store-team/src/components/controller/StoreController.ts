import BaseController from "./BaseController";
import StoreView from "../view/Store/store";

export default class StoreController extends BaseController {
    private storeView: StoreView;
    constructor() {
        super();
        this.storeView = new StoreView();
    }
    public override init(options?: string): void {
        //parse data from json
        //fill main page with template
        this.storeView.drawStore();
        //fill tempalte
    }
}
