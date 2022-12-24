import BaseController from "./BaseController";
import StoreView from "../view/Store/store";
import { Store } from "../model/Store";
import { app } from "../..";
import { IStoreFilterOptions } from "../model/type/IFilterOptions";
import Cart from "../model/Cart";

export default class StoreController extends BaseController {
    private storeView: StoreView;
    constructor() {
        super();
        this.storeView = new StoreView();
    }
    public override async init(options?: string): Promise<void> {
        let storeOptions: IStoreFilterOptions = new IStoreFilterOptions();
        if (options) {
            storeOptions = this.getStoreOptions(options);
        }
        this.storeView.drawStore(storeOptions);
    }

    private getStoreOptions(options: string): IStoreFilterOptions {
        const storeFilterOptions: IStoreFilterOptions = new IStoreFilterOptions();
        options = options.slice(1);

        const optionsArr = options.split("&");
        for (const option of optionsArr) {
            const [key, value] = option.split("=");
            if (key && value) {
                if (Object.prototype.hasOwnProperty.call(storeFilterOptions, key)) {
                    const k = storeFilterOptions[key as keyof typeof storeFilterOptions];
                    if (Array.isArray(k)) {
                        storeFilterOptions[key as keyof IStoreFilterOptions] = value.split("+");
                    } else {
                        storeFilterOptions[key as keyof IStoreFilterOptions] = value;
                    }
                }
            }
        }
        console.log(storeFilterOptions);
        return storeFilterOptions;
    }
}
