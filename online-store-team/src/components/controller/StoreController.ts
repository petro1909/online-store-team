import BaseController from "./BaseController";
import StoreView from "../view/Store/store";
import { StoreFilterOptions } from "../model/type/IFilterOptions";

export default class StoreController extends BaseController {
    private storeView: StoreView;
    constructor() {
        super();
        this.storeView = new StoreView();
    }
    public override async init(options?: string): Promise<void> {
        let storeOptions: StoreFilterOptions = new StoreFilterOptions();
        if (options) {
            storeOptions = this.getStoreOptions(options);
        }
        this.storeView.drawStore(storeOptions);
    }

    public getStoreOptions(queryString: string): StoreFilterOptions {
        const storeOptions: StoreFilterOptions = new StoreFilterOptions();
        queryString = queryString.slice(1);
        const optionsArr = queryString.split("&");
        for (const option of optionsArr) {
            const [key, value] = option.split("=");
            if (key && value) {
                if (
                    Object.prototype.hasOwnProperty.call(storeOptions, key) &&
                    typeof storeOptions[key as keyof typeof storeOptions] !== "function"
                ) {
                    const keyType = storeOptions[key as keyof typeof storeOptions];
                    if (Array.isArray(keyType)) {
                        storeOptions[key as keyof typeof storeOptions] = value.split("+") as never;
                    } else if (typeof keyType === "number") {
                        storeOptions[key as keyof StoreFilterOptions] = Number(value) as never;
                    } else {
                        storeOptions[key as keyof StoreFilterOptions] = value as never;
                    }
                }
            }
        }
        // console.log(storeOptions);
        return storeOptions;
    }
}
