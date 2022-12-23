/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ISortOptions, IStoreFilterOptions } from "./type/IFilterOptions";
import { Product } from "./type/IProduct";

interface ICategoryProducts {
    category: string;
    activeProducts: number;
    totalProducts: number;
}
interface IBrandProducts {
    brand: string;
    activeProducts: number;
    totalProducts: number;
}
export default class StoreFilter {
    public static sortMap: Map<string, ISortOptions> = new Map<string, ISortOptions>([
        ["price-ASC", { sortingParameter: "price", order: 1 }],
        ["price-DESC", { sortingParameter: "price", order: -1 }],
        ["rating-ASC", { sortingParameter: "rating", order: 1 }],
        ["rating-DESC", { sortingParameter: "rating", order: -1 }],
        ["discount-ASC", { sortingParameter: "discount", order: 1 }],
        ["discount-DESC", { sortingParameter: "discount", order: -1 }],
    ]);
    public categoryProducts: Array<ICategoryProducts> = [];
    public brandProducts: Array<IBrandProducts> = [];
    public minPrice: number;
    public maxPrice: number;
    public minStock: number;
    public maxStock: number;

    constructor() {
        this.minPrice = 0;
        this.maxPrice = 0;
        this.minStock = 0;
        this.maxStock = 0;
    }

    public updateFilter(products: Array<Product>, options: IStoreFilterOptions): Array<Product> {
        //this.categoryProducts = [];
        this.minPrice = products[0]!.price;
        this.maxPrice = products[0]!.price;
        this.minStock = products[0]!.stock;
        this.maxPrice = products[0]!.stock;
        const activeProducts: Array<Product> = [];
        for (const product of products) {
            if (this.filterProduct(product, options) && this.searchProduct(product, options)) {
                activeProducts.push(product);
            }
            this.initFilterFields(product, options);
        }
        console.log(this);
        return this.sortProducts(activeProducts, options);
    }

    private initFilterFields(product: Product, options: IStoreFilterOptions) {
        //fill products count by category
        let categoryProduct = this.categoryProducts.find((item) => item.category === product.category);
        if (!categoryProduct) {
            categoryProduct = { category: product.category, activeProducts: 0, totalProducts: 1 };
            this.categoryProducts.push(categoryProduct);
        } else {
            categoryProduct.totalProducts += 1;
        }
        const categories = options.categories;
        if (categories && categories.length > 0) {
            if (categories.includes(product.category)) categoryProduct.activeProducts += 1;
        } else {
            categoryProduct.activeProducts += 1;
        }
        //fill products count by brand
        let brandProduct = this.brandProducts.find((item) => item.brand === product.brand);
        if (!brandProduct) {
            brandProduct = { brand: product.brand, activeProducts: 0, totalProducts: 1 };
            this.brandProducts.push(brandProduct);
        } else {
            brandProduct.totalProducts += 1;
        }
        const brands = options.brands;
        if (brands && brands.length > 0) {
            if (brands.includes(product.brand)) brandProduct.activeProducts += 1;
        } else {
            brandProduct.activeProducts += 1;
        }
        //fill minPrice
        const minPrice = options.minPrice;
        if (minPrice) {
            this.minPrice = minPrice;
        } else {
            if (product.price < this.minPrice) {
                this.minPrice = product.price;
            }
        }
        const maxPrice = options.maxPrice;
        if (maxPrice) {
            this.maxPrice = maxPrice;
        } else {
            if (product.price > this.maxPrice) {
                this.maxPrice = product.price;
            }
        }
        const minStock = options.minStock;
        if (minStock) {
            this.minStock = minStock;
        } else {
            if (product.stock < this.minStock) {
                this.minStock = product.stock;
            }
        }
        const maxStock = options.maxStock;
        if (maxStock) {
            this.maxStock = maxStock;
        } else {
            if (product.stock > this.maxStock) {
                this.maxStock = product.stock;
            }
        }
    }
    private filterProduct(item: Product, filterOptions: IStoreFilterOptions): boolean {
        //app.router.addQueryParameters(filterOptions);
        const categories = filterOptions.categories;
        if (categories && categories.length > 0) {
            const isInCategory = categories.find((category) => category === item.category);
            if (!isInCategory) return false;
        }
        const brands = filterOptions.brands;
        if (brands && brands.length > 0) {
            const isInBrand = brands.find((brand) => brand === item.brand);
            if (!isInBrand) return false;
        }
        const minPrice = filterOptions.minPrice;
        if (minPrice) {
            const isInPrice = item.price <= minPrice;
            if (!isInPrice) return false;
        }
        const maxPrice = filterOptions.maxPrice;
        if (maxPrice) {
            const isInPrice = item.price >= maxPrice;
            if (!isInPrice) return false;
        }
        const minStock = filterOptions.minStock;
        if (minStock) {
            const isInStock = item.stock <= minStock;
            if (!isInStock) return false;
        }
        const maxStock = filterOptions.maxStock;
        if (maxStock) {
            const isInStock = item.stock >= maxStock;
            if (!isInStock) return false;
        }
        return true;
    }

    private searchProduct(item: Product, filterOptions: IStoreFilterOptions): boolean {
        const searchString = filterOptions.searchString;
        if (!searchString) {
            return true;
        }
        //app.router.addQueryParameters(searchOptions);
        return item.title.includes(searchString) || item.description.includes(searchString);
    }

    public getActiveProducts(products: Array<Product>, options: IStoreFilterOptions) {
        let activeProducts = this.filterProducts(products, options);
        activeProducts = this.searchProducts(products, options);
        activeProducts = this.sortProducts(products, options);
        return activeProducts;
    }

    private filterProducts(products: Array<Product>, filterOptions: IStoreFilterOptions): Array<Product> {
        //app.router.addQueryParameters(filterOptions);
        return products.filter((item) => {
            const categories = filterOptions.categories;
            if (categories) {
                const isInCategory = categories.find((category) => category === item.category);
                if (!isInCategory) return false;
            }
            const brands = filterOptions.brands;
            if (brands) {
                const isInBrand = brands.find((brand) => brand === item.brand);
                if (!isInBrand) return false;
            }
            const minPrice = filterOptions.minPrice;
            if (minPrice) {
                const isInPrice = item.price <= minPrice;
                if (!isInPrice) return false;
            }
            const maxPrice = filterOptions.maxPrice;
            if (maxPrice) {
                const isInPrice = item.price >= maxPrice;
                if (!isInPrice) return false;
            }
            const minStock = filterOptions.minStock;
            if (minStock) {
                const isInStock = item.stock <= minStock;
                if (!isInStock) return false;
            }
            const maxStock = filterOptions.maxStock;
            if (maxStock) {
                const isInStock = item.stock >= maxStock;
                if (!isInStock) return false;
            }
            return true;
        });
    }

    private sortProducts(products: Array<Product>, filterOptions: IStoreFilterOptions): Array<Product> {
        const sortingString = filterOptions.sortingString;
        if (!sortingString) {
            return products;
        }
        const sortingOptions = StoreFilter.sortMap.get(sortingString);
        if (!sortingOptions) {
            return products;
        }
        //app.router.addQueryParameters(sortOptions);
        return products.sort((a, b) => {
            const par1 = a[sortingOptions.sortingParameter as keyof Product];
            const par2 = b[sortingOptions.sortingParameter as keyof Product];
            if (sortingOptions.order === 1) {
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

    private searchProducts(products: Array<Product>, filterOptions: IStoreFilterOptions): Array<Product> {
        const searchString = filterOptions.searchString;
        if (!searchString) {
            return products;
        }
        //app.router.addQueryParameters(searchOptions);
        return products.filter((item) => item.title.includes(searchString) || item.description.includes(searchString));
    }
}
