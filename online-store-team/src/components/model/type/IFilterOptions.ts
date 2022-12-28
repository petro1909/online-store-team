export class StoreFilterOptions {
    categories: Array<string> = [];
    brands: Array<string> = [];
    minPrice = 0;
    maxPrice = 0;
    minStock = 0;
    maxStock = 0;
    searchString = "";
    displayMode = "";
    sortingString = "";
}

export class CartOptions {
    page = 0;
    limit = 0;
    constructor(page = 1, limit = 3) {
        this.page = page;
        this.limit = limit;
    }
}
// export interface ISearchOptions extends IBaseOptions {
//     searchString: string;
// }

// export interface IDisplayOptions extends IBaseOptions {
//     displayMode: string;
// }

export interface ISortOptions {
    sortingParameter: string;
    order: number;
}
