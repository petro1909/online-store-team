import StoreFilter from "./StoreFilter";
import { StoreFilterOptions } from "./type/IFilterOptions";
import { Product, ProductJsonResult } from "./type/IProduct";

export class Store {
    public products: Array<Product> = [];
    public categories: Array<string> = [];
    private filter!: StoreFilter;

    public async initStore(): Promise<void> {
        const storeJsonResult = await this.getProducts();
        this.products = storeJsonResult.products;
        this.filter = new StoreFilter(this.products);
    }
    private async getProducts(): Promise<ProductJsonResult> {
        const res = await fetch("https://dummyjson.com/products?limit=100");
        return await (res.json() as Promise<ProductJsonResult>);
    }
    public updateFilterProducts(options: StoreFilterOptions = new StoreFilterOptions()): Array<Product> {
        return this.filter.updateFilter(this.products, options);
    }
    public getFilter(): StoreFilter {
        return this.filter;
    }

    public async removeDuplicatesFromProductImages(product: Product) {
        const imageMap: Map<number, string> = new Map<number, string>();
        for (const image of product.images) {
            const response = await fetch(image);
            const arrayBuffer = await response.arrayBuffer();
            imageMap.set(arrayBuffer.byteLength, image);
        }
        product.images = Array.from(imageMap.values());
    }
}
