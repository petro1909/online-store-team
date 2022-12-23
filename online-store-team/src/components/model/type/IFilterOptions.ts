export interface IStoreFilterOptions {
    categories?: Array<string>;
    brands?: Array<string>;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    searchString?: string;
    displayMode?: string;
    sortingString?: string;
}

export interface ICartOptions {
    page?: number;
    limit?: number;
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

// export interface IBaseOptions {
//     [key: string]: string | number | Array<string> | undefined;
// }
