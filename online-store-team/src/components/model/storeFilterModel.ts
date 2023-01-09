import { StoreFilterOptions } from "./storeOptions";
import { ISortOptions } from "./type/sortOptions";
import { Product } from "./type/product";

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
        ["discount-ASC", { sortingParameter: "discountPercentage", order: 1 }],
        ["discount-DESC", { sortingParameter: "discountPercentage", order: -1 }],
    ]);
    public categoryProducts: Array<ICategoryProducts> = [];
    public brandProducts: Array<IBrandProducts> = [];
    public minPrice = 0;
    public maxPrice = 0;
    public minStock = 0;
    public maxStock = 0;

    constructor(products: Array<Product>) {
        this.initFilterFields(products);
    }
    public initFilterFields(products: Array<Product>) {
        const productPriceArray = products.map((product) => product.price);
        this.minPrice = Math.min(...productPriceArray);
        this.maxPrice = Math.max(...productPriceArray);
        const productStockArray = products.map((product) => product.stock);
        this.minStock = Math.min(...productStockArray);
        this.maxStock = Math.max(...productStockArray);

        this.categoryProducts = Array.from(new Set(products.map((product) => product.category))).map(
            (uniqeCategory) => {
                const categoryProduct = { category: uniqeCategory, activeProducts: 0, totalProducts: 0 };
                return categoryProduct;
            }
        );
        this.categoryProducts.forEach((productByCategory) => {
            const categoryProduct = products.filter((product) => product.category === productByCategory.category);
            productByCategory.totalProducts = productByCategory.activeProducts = categoryProduct.length;
        });
        this.brandProducts = Array.from(new Set(products.map((product) => product.brand))).map((uniqeBrand) => {
            const brandProduct = { brand: uniqeBrand, activeProducts: 0, totalProducts: 0 };
            return brandProduct;
        });
        this.brandProducts.forEach((productByBrand) => {
            const brandProduct = products.filter((product) => product.brand === productByBrand.brand);
            productByBrand.totalProducts = productByBrand.activeProducts = brandProduct.length;
        });
    }

    public getActiveProducts(products: Array<Product>, options: StoreFilterOptions): Array<Product> {
        let activeProducts = this.filterProducts(products, options);
        console.log(activeProducts);
        activeProducts = this.searchProducts(activeProducts, options);
        activeProducts = this.sortProducts(activeProducts, options);
        return activeProducts;
    }
    public updateFilterFields(products: Array<Product>, options?: StoreFilterOptions) {
        if (!options) {
            return;
        }
        const productPriceArray = products.map((product) => product.price);
        if (options.minPrice > 0) {
            this.minPrice = options.minPrice;
        } else {
            this.minPrice = Math.min(...productPriceArray);
        }
        if (options.maxPrice > 0) {
            this.maxPrice = options.maxPrice;
        } else {
            this.maxPrice = Math.max(...productPriceArray);
        }
        const productStockArray = products.map((product) => product.stock);
        if (options.minStock > 0) {
            this.minStock = options.minStock;
        } else {
            this.minStock = Math.min(...productStockArray);
        }
        if (options.maxStock > 0) {
            this.maxStock = options.maxStock;
        } else {
            this.maxStock = Math.max(...productStockArray);
        }

        this.categoryProducts.forEach((productByCategory) => {
            productByCategory.activeProducts = 0;
            const categoryProduct = products.filter((product) => product.category === productByCategory.category);
            productByCategory.activeProducts = categoryProduct.length;
        });
        this.brandProducts.forEach((productByBrand) => {
            productByBrand.activeProducts = 0;
            const brandProduct = products.filter((product) => product.brand === productByBrand.brand);
            productByBrand.activeProducts = brandProduct.length;
        });
    }

    private filterProducts(products: Array<Product>, filterOptions: StoreFilterOptions): Array<Product> {
        const activeProducts = products.filter((product) => {
            const categories = filterOptions.categories;
            if (categories.length !== 0) {
                const isInCategory = categories.find((category) => category === product.category);
                if (!isInCategory) return false;
            }
            const brands = filterOptions.brands;
            if (brands.length !== 0) {
                const isInBrand = brands.find((brand) => brand === product.brand);
                if (!isInBrand) return false;
            }
            const minPrice = filterOptions.minPrice;
            if (minPrice) {
                const isInPrice = product.price >= minPrice;
                if (!isInPrice) return false;
            }
            const maxPrice = filterOptions.maxPrice;
            if (maxPrice) {
                const isInPrice = product.price <= maxPrice;
                if (!isInPrice) return false;
            }
            const minStock = filterOptions.minStock;
            if (minStock) {
                const isInStock = product.stock >= minStock;
                if (!isInStock) return false;
            }
            const maxStock = filterOptions.maxStock;
            if (maxStock) {
                const isInStock = product.stock <= maxStock;
                if (!isInStock) return false;
            }
            return true;
        });
        return activeProducts;
    }

    private sortProducts(products: Array<Product>, filterOptions: StoreFilterOptions): Array<Product> {
        const sortingString = filterOptions.sortingString;
        if (!sortingString) {
            return products;
        }
        const sortingOptions = StoreFilter.sortMap.get(sortingString);
        if (!sortingOptions) {
            return products;
        }
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

    private searchProducts(products: Array<Product>, filterOptions: StoreFilterOptions): Array<Product> {
        const searchString = filterOptions.searchString;
        if (!searchString) {
            return products;
        }
        const lowerSearchString = searchString.toLowerCase();
        return products.filter(
            (item) =>
                item.title.toLowerCase().includes(lowerSearchString) ||
                item.description.toLowerCase().includes(lowerSearchString) ||
                item.price.toString().includes(lowerSearchString) ||
                item.discountPercentage.toString().includes(lowerSearchString) ||
                item.rating.toString().includes(lowerSearchString) ||
                item.stock.toString().includes(lowerSearchString) ||
                item.brand.toLowerCase().includes(lowerSearchString) ||
                item.category.toLowerCase().includes(lowerSearchString) ||
                item.thumbnail.toLowerCase().includes(lowerSearchString)
        );
    }

    public filterProduct(item: Product, filterOptions: StoreFilterOptions): boolean {
        const categories = filterOptions.categories;
        if (categories && categories.length > 0) {
            const isInCategory = categories.find((category) => category.toLowerCase() === item.category.toLowerCase());
            if (!isInCategory) return false;
        }
        const brands = filterOptions.brands;
        if (brands && brands.length > 0) {
            const isInBrand = brands.find((brand) => brand.toLowerCase() === item.brand.toLowerCase());
            if (!isInBrand) return false;
        }
        const minPrice = filterOptions.minPrice;
        if (minPrice) {
            const isInPrice = item.price >= minPrice;
            if (!isInPrice) return false;
        }
        const maxPrice = filterOptions.maxPrice;
        if (maxPrice) {
            const isInPrice = item.price <= maxPrice;
            if (!isInPrice) return false;
        }
        const minStock = filterOptions.minStock;
        if (minStock) {
            const isInStock = item.stock >= minStock;
            if (!isInStock) return false;
        }
        const maxStock = filterOptions.maxStock;
        if (maxStock) {
            const isInStock = item.stock <= maxStock;
            if (!isInStock) return false;
        }
        return true;
    }

    public searchProduct(item: Product, filterOptions: StoreFilterOptions): boolean {
        const searchString = filterOptions.searchString;
        if (!searchString) {
            return true;
        }
        const lowerSearchString = searchString.toLowerCase();
        return (
            item.title.toLowerCase().includes(lowerSearchString) ||
            item.description.toLowerCase().includes(lowerSearchString) ||
            item.price.toString().includes(lowerSearchString) ||
            item.discountPercentage.toString().includes(lowerSearchString) ||
            item.rating.toString().includes(lowerSearchString) ||
            item.stock.toString().includes(lowerSearchString) ||
            item.brand.toLowerCase().includes(lowerSearchString) ||
            item.category.toLowerCase().includes(lowerSearchString) ||
            item.thumbnail.toLowerCase().includes(lowerSearchString)
        );
    }
}
