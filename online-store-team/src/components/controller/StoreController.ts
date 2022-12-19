import BaseController from "./BaseController";
import StoreView from "../view/Store/store";
import { Store } from "../model/Store";
import App from "../app/App";

export default class StoreController extends BaseController {
    private storeView: StoreView;
    private store: Store;
    constructor() {
        super();
        this.store = App.store;
        this.storeView = new StoreView();
    }
    public override async init(options?: string): Promise<void> {
        //parse data from json
        let storeOptions: StoreOptions;
        if (options) {
            storeOptions = this.getStoreOptions(options);
        }
        this.storeView.drawStore(this.store, storeOptions);
        //fill main page with template
        //fill tempalte
    }

    private getStoreOptions(options: string): Options {

    }
}
