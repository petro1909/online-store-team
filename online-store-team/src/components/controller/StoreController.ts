import BaseController from "./BaseController";
import StoreView from "../view/Store/store";
import { Store } from "../model/Store";
import { app } from "../..";
import { IFilterOptions } from "../model/type/IFilterOptions";
import Cart from "../model/Cart";

export default class StoreController extends BaseController {
    private storeView: StoreView;
    private store: Store;
    private cart: Cart;
    constructor() {
        super();
        this.store = app.store;
        this.cart = app.cart;
        this.storeView = new StoreView();
    }
    public override async init(options?: string): Promise<void> {
        // let storeOptions: StoreOptions;
        // if (options) {
        //     storeOptions = this.getStoreOptions(options);
        // }
        this.storeView.drawStore(this.store, this.cart);
    }

    // private getStoreOptions(options: string): IFilterOptions {
    //     const storeOptions: IFilterOptions = {};
    //     const optionsArr = options.split("&");
    //     for (const option of optionsArr) {
    //         const [key, value] = option.split("=");
    //         if (key && value) {
    //             // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //             const keyType: IFilterOptions[typeof key] = key;

    //             storeOptions[key as keyof IFilterOptions] = value;
    //         }
    //     }
    //     return storeOptions;
    // }
}
