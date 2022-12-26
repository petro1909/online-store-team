/* eslint-disable @typescript-eslint/no-non-null-assertion */
import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";
import "./filter.css";
import { Product } from "../../model/type/IProduct";
import { app } from "../../..";
import StoreFilter from "../../model/StoreFilter";
import { StoreFilterOptions } from "../../model/type/IFilterOptions";

export default class StoreView {
    private filterOptions: StoreFilterOptions = new StoreFilterOptions();

    public drawStore(options: StoreFilterOptions): void {
        this.filterOptions = options;
        console.log(this.filterOptions);
        document.getElementById("root")!.innerHTML = storeHtml;
        const activeProducts = app.store.updateFilterProducts(options);
        this.drawProducts(activeProducts);
        const filter = app.store.getFilter();
        this.drawFilter(filter);
    }

    private drawProducts(products: Array<Product>) {
        //console.log("drawProducts =", products);
        const productItemTemplate = document.getElementById("productItemTemp") as HTMLTemplateElement;
        const fragment: DocumentFragment = document.createDocumentFragment();
        // const cartItemsIds  = this.selectCartItemsIds(app.cart); // TODO refactor;
        document.querySelector(".found__value")!.innerHTML = `${products.length}`;
        products.forEach((item: Product): void => {
            const templateClone = productItemTemplate.content.cloneNode(true) as HTMLElement;

            const articleElem = templateClone.querySelector(".product-item")! as HTMLDivElement;
            articleElem.style.backgroundImage = `url(${item.thumbnail})`;
            articleElem.setAttribute("data-id", String(item.id)); // Set tag article attribute "data-id" as product ID
            templateClone.querySelector(".product-item__title")!.textContent = item.title;
            templateClone.querySelector(".info__row-category")!.textContent = item.category;
            templateClone.querySelector(".info__row-brand")!.textContent = item.brand;
            templateClone.querySelector(".info__row-price")!.textContent = "€" + item.price;
            templateClone.querySelector(".info__row-discount")!.textContent = item.discountPercentage + "%";
            templateClone.querySelector(".info__row-rating")!.textContent = String(item.rating);
            templateClone.querySelector(".info__row-stock")!.textContent = String(item.stock);

            const isId = app.cart.isProductInCart(item.id);
            if (isId) {
                const currentAddButton = templateClone.querySelector(".button-add")! as HTMLElement;
                StoreView.styleProductCard("DROP FROM CART", currentAddButton);
            }

            fragment.append(templateClone);
        });

        document.querySelector(".goods__output")!.appendChild(fragment);

        document.querySelector(".goods__output")!.addEventListener("click", this.productClickHandler);
    }

    // private selectCartItemsIds(cart: Cart) { // TODO refactor;
    //     const items = cart.cartProducts;
    //     const itemIds: Array<number> = items.map((item): number => { return item.product.id})
    //     return itemIds;
    // }

    private productClickHandler(event: Event): void {
        const clickedElement = event.target as HTMLElement;
        // const articleElem = clickedElement.closest(".product-item")!;
        if (!clickedElement!.classList.contains("goods__output")) {
            const productId = clickedElement.closest(".product-item")!.getAttribute("data-id");
            const product = app.store.products.find((item) => item.id === +productId!);
            if (clickedElement.classList.contains("button-add")) {
                // clickedElement.classList.toggle("button-add");
                // clickedElement.classList.toggle("button-drop");
                // articleElem.classList.toggle("product-item_added");
                // clickedElement.textContent = "DROP FROM CART";

                StoreView.styleProductCard("DROP FROM CART", clickedElement);

                app.cart.putProductIntoCart(product!);
                app.header.drawHeader(app.cart);
            } else if (clickedElement.classList.contains("button-drop")) {
                // clickedElement.classList.toggle("button-add");
                // clickedElement.classList.toggle("button-drop");
                // articleElem.classList.toggle("product-item_added");
                // clickedElement.textContent = "ADD TO CART";

                StoreView.styleProductCard("ADD TO CART", clickedElement);

                app.cart.dropProductIntoCart(+productId!);
                app.header.drawHeader(app.cart);
            } else if (clickedElement.classList.contains("button-details")) {
                app.router.route(`/product/${productId}`);
                //window.history.replaceState({}, "", window.location.pathname + "product/" + productId);
                //window.location.replace
                //window.location.href = window.location.pathname + "product/" + productId;
            } else {
                app.router.route(`/product/${productId}`);
                // console.log("product card pressed, id", productId);
            }
        }
    }

    private drawFilter(filter: StoreFilter) {
        const filterSection = document.querySelector(".filter");
        filterSection!.innerHTML = filterHtml;
        filterSection!.addEventListener("click", this.updateFilter);
        //fill filter section with filter object
    }

    private updateFilter() {
        const categoriesCheckboxesValues: Array<string> = []; //get all active category checkboxes
        const brandCheckboxesValues: Array<string> = []; //get add active checkboxes values
        const minPrice = 0;
        const maxPrice = 0;
        const minStock = 0;
        const maxStock = 0;
        const searchString = "";
        const sortString = "";
        const displayMode = "";
        this.filterOptions.brands = brandCheckboxesValues;
        this.filterOptions.categories = categoriesCheckboxesValues;
        this.filterOptions.maxPrice = maxPrice;
        this.filterOptions.minPrice = minPrice;
        this.filterOptions.minStock = minStock;
        this.filterOptions.maxStock = maxStock;
        this.filterOptions.searchString = searchString;
        this.filterOptions.sortingString = sortString;
        this.filterOptions.displayMode = displayMode;
        this.drawStore(this.filterOptions);
    }
    public static styleProductCard(textContent: string, clickedButton: HTMLElement): void {
        const articleElem = clickedButton.closest(".product-item")!;
        clickedButton.classList.toggle("button-add");
        clickedButton.classList.toggle("button-drop");
        articleElem.classList.toggle("product-item_added");
        clickedButton.textContent = textContent;
    }
}
