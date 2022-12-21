import { app } from "../..";
import { ISortOptions, IFilterOptions, ISearchOptions } from "./type/IFilterOptions";
import { Product, ProductJsonResult } from "./type/IProduct";

export class Store {
    public products: Array<Product> = [];
    public activeProducts: Array<Product> = [];
    public categories: Array<string> = [];
    public sortMap: Map<string, ISortOptions> | undefined;

    public async initStore(): Promise<void> {
        const storeJsonResult = await this.getProducts();
        this.products = this.activeProducts = storeJsonResult.products;
        // this.getProducts().then((res) => {
        //     this.products = res.products;
        //     this.activeProducts = res.products;
        //     console.log(this.products);
        // });
        // this.getCategories().then((res) => {
        //     this.categories = res;
        // });
        this.sortMap = new Map<string, ISortOptions>([
            ["price-ASC", { sortingParameter: "price", order: 1 }],
            ["price-DESC", { sortingParameter: "price", order: -1 }],
            ["rating-ASC", { sortingParameter: "rating", order: 1 }],
            ["rating-DESC", { sortingParameter: "rating", order: -1 }],
            ["discount-ASC", { sortingParameter: "discount", order: 1 }],
            ["discount-DESC", { sortingParameter: "discount", order: -1 }],
        ]);
    }
    private async getProducts(): Promise<ProductJsonResult> {
        const res = await fetch("https://dummyjson.com/products?limit=100");
        return await (res.json() as Promise<ProductJsonResult>);
    }
    private async getCategories(): Promise<Array<string>> {
        const categoriesResult = await fetch("https://dummyjson.com/products/categories").then((res) => {
            return res.json() as Promise<Array<string>>;
        });
        return categoriesResult;
    }

    // public filterProducts(filterOptions: IFilterOptions): Array<Product> {
    //     app.router.addQueryParameters(filterOptions);
    //     return this.activeProducts.filter((item) => {
    //         const isInCategory = filterOptions.categories.find((category) => category === item.category);
    //         if (!isInCategory) return false;
    //         const isInBrand = filterOptions.brands.find((brand) => brand === item.brand);
    //         if (!isInBrand) return false;
    //         const isInPrice = item.price >= filterOptions.minPrice && item.price <= filterOptions.maxPrice;
    //         if (!isInPrice) return false;
    //         const isInStock = item.stock >= filterOptions.minStock && item.stock <= filterOptions.maxStock;
    //         if (!isInStock) return false;
    //         return true;
    //     });
    // }

    public sortProducts(sortOptions: ISortOptions): Array<Product> {
        app.router.addQueryParameters(sortOptions);
        return this.activeProducts.sort((a, b) => {
            const par1 = a[sortOptions.sortingParameter as keyof Product];
            const par2 = b[sortOptions.sortingParameter as keyof Product];
            if (sortOptions.order === 1) {
                if (par1 > par2) {
                    return 1;
                } else if (par1 < par2) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                if (par1 < par2) {
                    return 1;
                } else if (par1 > par2) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
    }

    public searchProducts(searchOptions: ISearchOptions): Array<Product> {
        app.router.addQueryParameters(searchOptions);
        return this.activeProducts.filter(
            (item) => item.title === searchOptions.searchString || item.description === searchOptions.searchString
        );
    }
}
