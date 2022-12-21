export interface IFilterOptions extends IBaseOptions {
    categories?: Array<string>;
    brands?: Array<string>;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
}

export interface IPageOptions extends IBaseOptions {
    page: number;
}

export interface ISearchOptions extends IBaseOptions {
    searchString: string;
}

export interface IDisplayOptions extends IBaseOptions {
    displayMode: string;
}

export interface ISortOptions extends IBaseOptions {
    sortingParameter: string;
    order: number;
}

export interface IBaseOptions {
    [key: string]: string | number | Array<string> | undefined;
}
