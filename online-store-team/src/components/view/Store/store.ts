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
        console.log("activeProducts =", activeProducts);
        this.drawProducts(activeProducts);
        const filter = app.store.getFilter();
        console.log("filter =", filter);
        this.drawFilter(filter);
    }

    private drawProducts(products: Array<Product>) {
        //console.log("drawProducts =", products);
        const productItemTemplate = document.getElementById("productItemTemp") as HTMLTemplateElement;
        const fragment: DocumentFragment = document.createDocumentFragment();

        document.querySelector(".found__value")!.innerHTML = `${products.length}`;
        document.querySelector(".goods__output")!.innerHTML = "";
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
            if (this.filterOptions.displayMode === "6") articleElem.classList.add("product-item_small");
            fragment.append(templateClone);
        });

        document.querySelector(".goods__output")!.appendChild(fragment);
        document.querySelector(".goods__output")!.addEventListener("click", this.productClickHandler);
    }

    private productClickHandler(event: Event): void {
        const clickedElement = event.target as HTMLElement;
        if (!clickedElement!.classList.contains("goods__output")) {
            const productId = clickedElement.closest(".product-item")!.getAttribute("data-id");
            const product = app.store.products.find((item) => item.id === +productId!);
            if (clickedElement.classList.contains("button-add")) {
                StoreView.styleProductCard("DROP FROM CART", clickedElement);
                app.cart.putProductIntoCart(product!);
                app.header.drawHeader(app.cart);
            } else if (clickedElement.classList.contains("button-drop")) {
                StoreView.styleProductCard("ADD TO CART", clickedElement);
                app.cart.dropProductIntoCart(+productId!);
                app.header.drawHeader(app.cart);
            } else if (clickedElement.classList.contains("button-details")) {
                app.router.route(`/product/${productId}`);
            } else {
                app.router.route(`/product/${productId}`);
            }
        }
    }

    private drawFilter(filter: StoreFilter) {
        // console.log("filter =", filter);
        const filterSection = document.querySelector(".filter");
        filterSection!.insertAdjacentHTML("beforeend", filterHtml);
        const category = document.getElementById("category")!;
        const brand = document.getElementById("brand")!;
        const minPrice = document.getElementById("min-price")! as HTMLInputElement;
        const maxPrice = document.getElementById("max-price")! as HTMLInputElement;
        const minStock = document.getElementById("min-stock")! as HTMLInputElement;
        const maxStock = document.getElementById("max-stock")! as HTMLInputElement;

        filter.categoryProducts.forEach((item) => {
            // TODO refactor put in a separate function
            category.innerHTML += `<div class="checkbox-line checkbox-active">
                                    <input class="checkbox"
                                    type="checkbox" id="${item.category}"
                                    value="${item.category}"
                                    name="category">
                                    <label for="${item.category}">${item.category}</label>
                                    <span>${item.activeProducts}/${item.totalProducts}</span>
                                </div>`;
        });
        filter.brandProducts.forEach((item) => {
            brand.innerHTML += `<div class="checkbox-line checkbox-active">
                                    <input class="checkbox"
                                    type="checkbox"
                                    id="${item.brand}"
                                    value="${item.brand}"
                                    name="brand">
                                    <label for="${item.brand}">${item.brand}</label>
                                    <span>${item.activeProducts}/${item.totalProducts}</span>
                                </div>`;
        });

        minPrice.value = String(filter.minPrice);
        minPrice.min = String(filter.minPrice);
        maxPrice.value = String(filter.maxPrice);
        maxPrice.max = String(filter.maxPrice);
        minStock.value = String(filter.minStock);
        minStock.min = String(filter.minStock);
        maxStock.value = String(filter.maxStock);
        maxStock.max = String(filter.maxStock);

        filterSection!.addEventListener("input", this.updateFilter);
        filterSection!.addEventListener("reset", this.resetHandler);
    }

    private resetHandler() {
        app.router.route("/");
        console.log("reset form");
    }

    private updateFilter = (event: Event) => {
        const formElement = document.getElementById("filters")! as HTMLFormElement;
        const formData = new FormData(formElement);
        const filterOptions = this.filterOptions;
        const element = event.target as HTMLInputElement;
        const name = element.name;

        switch (name) {
            case "category":
                filterOptions.categories = formData.getAll(name) as Array<string>;
                console.log("filterOptions.categories =", filterOptions.categories);
                break;
            case "brand":
                filterOptions.brands = formData.getAll(name) as Array<string>;
                console.log("filterOptions.brands =", filterOptions.categories);
                break;
            case "search":
                filterOptions.searchString = element.value;
                console.log("search =", element.value);
                break;
            case "select":
                filterOptions.sortingString = element.value;
                console.log("sort =", element.value);
                break;
            case "min-price":
                filterOptions.minPrice = Number(element.value);
                console.log("minPrice =", element.value);
                break;
            case "max-price":
                filterOptions.maxPrice = Number(element.value);
                console.log("maxPrice =", element.value);
                break;
            case "min-stock":
                filterOptions.minStock = Number(element.value);
                console.log("minStock =", element.value);
                break;
            case "max-stock":
                filterOptions.maxStock = Number(element.value);
                console.log("maxStock =", element.value);
                break;
            case "display-mode":
                filterOptions.displayMode = String(element.value);
                console.log("display-mode =", element.value);
                break;
            default:
                break;
        }
        this.drawStore(this.filterOptions);
        // const newView = new StoreView();
        // console.log(this.filterOptions);
        // const activeProducts = app.store.updateFilterProducts(this.filterOptions);
        // newView.drawProducts(activeProducts);
    };

    public static styleProductCard(textContent: string, clickedButton: HTMLElement): void {
        const articleElem = clickedButton.closest(".product-item")!;
        clickedButton.classList.toggle("button-add");
        clickedButton.classList.toggle("button-drop");
        articleElem.classList.toggle("product-item_added");
        clickedButton.textContent = textContent;
    }
}
