export class Store {
    public products: Array<Product>;
    public categories: Array<string>;
    constructor() {
        this.products = [];
        this.categories = [];
    }
    public async get() {
        const f = await fetch("https://dummyjson.com/products").then((res) => {
            console.log(res);
            // console.log(res.json());
            return res.json();
        });
        return f;
    }
}