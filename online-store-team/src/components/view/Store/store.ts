/* eslint-disable @typescript-eslint/no-non-null-assertion */
import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";
import { Product } from "../../model/type/IProduct";
import { app } from "../../..";
import StoreFilter from "../../model/StoreFilter";
import { IStoreFilterOptions } from "../../model/type/IFilterOptions";

export default class StoreView {
    private filterOptions: IStoreFilterOptions = {};

    public drawStore(options: IStoreFilterOptions): void {
        this.filterOptions = options;

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

        products.forEach((item: Product): void => {
            const templateClone = productItemTemplate.content.cloneNode(true) as HTMLElement;

            const articleElem = templateClone.querySelector(".product-item")! as HTMLDivElement;
            articleElem.style.background = `url(${item.thumbnail})`;
            articleElem.setAttribute("data-id", String(item.id)); // Set tag article attribute "data-id" as product ID
            templateClone.querySelector(".product-item__title")!.textContent = item.title;
            templateClone.querySelector(".info__row-category")!.textContent = item.category;
            templateClone.querySelector(".info__row-brand")!.textContent = item.brand;
            templateClone.querySelector(".info__row-price")!.textContent = "€" + item.price;
            templateClone.querySelector(".info__row-discount")!.textContent = item.discountPercentage + "%";
            templateClone.querySelector(".info__row-rating")!.textContent = String(item.rating);
            templateClone.querySelector(".info__row-stock")!.textContent = String(item.stock);

            fragment.append(templateClone);
        });

        document.querySelector(".goods__output")!.appendChild(fragment);
        //console.log(document.querySelector(".goods__output"));
        document.querySelector(".goods__output")!.addEventListener("click", this.productClickHandler);
    }
    private productClickHandler(event: Event): void {
        const clickedElement = event.target as HTMLElement;
        if (!clickedElement!.classList.contains("goods__output")) {
            const productId = clickedElement.closest(".product-item")!.getAttribute("data-id");
            if (clickedElement.classList.contains("button-add")) {
                const product = app.store.products.find((item) => item.id === +productId!);
                app.cart.putProductIntoCart(product!);
            } else if (clickedElement.classList.contains("button-drop")) {
                console.log("button-drop pressed, id", productId);
            } else if (clickedElement.classList.contains("button-details")) {
                app.router.route(`/product/${productId}`);
                //window.history.replaceState({}, "", window.location.pathname + "product/" + productId);
                //window.location.replace
                //window.location.href = window.location.pathname + "product/" + productId;
            } else {
                console.log("product card pressed, id", productId);
            }
        }
    }

    private drawFilter(filter: StoreFilter) {
        const filterSection = document.querySelector(".filter");
        filterSection!.innerHTML = filterHtml;
        console.log(filter);
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
}
