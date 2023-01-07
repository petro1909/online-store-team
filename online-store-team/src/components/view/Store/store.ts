/* eslint-disable @typescript-eslint/no-non-null-assertion */
import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";
import "./filter.css";
import { Product } from "../../model/type/product";
import { app } from "../../..";
import StoreFilter from "../../model/storeFilterModel";
import { StoreFilterOptions } from "../../model/storeOptions";

export default class StoreView {
    private filterOptions: StoreFilterOptions = new StoreFilterOptions();

    public drawStore(options: StoreFilterOptions): void {
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
                app.cart.dropProductFromCart(+productId!);
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

        const closeFilterButton = filterSection?.querySelector(".close-filter-button") as HTMLElement;
        closeFilterButton.addEventListener("click", this.hideFilter);
        window.addEventListener("resize", this.hideFilterByResizeWindow);
        const category = document.getElementById("category")!;
        const brand = document.getElementById("brand")!;
        const minPrice = document.getElementById("min-price")! as HTMLInputElement;
        const maxPrice = document.getElementById("max-price")! as HTMLInputElement;
        const minStock = document.getElementById("min-stock")! as HTMLInputElement;
        const maxStock = document.getElementById("max-stock")! as HTMLInputElement;

        filter.categoryProducts.forEach((item) => {
            // TODO refactor put in a separate function
            const isChecked = this.filterOptions.categories.includes(item.category) ? "checked" : "";
            category.innerHTML += `<div class="checkbox-line checkbox-active">
                                    <input class="checkbox"
                                    type="checkbox" id="${item.category}"
                                    value="${item.category}"
                                    name="category"
                                    ${isChecked}
                                    >
                                    <label for="${item.category}">${item.category}</label>
                                    <span>${item.activeProducts}/${item.totalProducts}</span>
                                </div>`;
        });
        filter.brandProducts.forEach((item) => {
            const isChecked = this.filterOptions.brands.includes(item.brand) ? "checked" : "";
            brand.innerHTML += `<div class="checkbox-line checkbox-active">
                                    <input class="checkbox"
                                    type="checkbox"
                                    id="${item.brand}"
                                    value="${item.brand}"
                                    name="brand"
                                    ${isChecked}>
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

        const priceFieldSet = document.getElementById("price");
        const stockFieldSet = document.getElementById("stock");

        stockFieldSet!.addEventListener("input", this.workRangeInput.bind(this, "stock", 8));
        priceFieldSet!.addEventListener("input", this.workRangeInput.bind(this, "price", 100));
        filterSection!.addEventListener("input", this.updateFilter);
        filterSection!.addEventListener("reset", this.resetHandler);
    }

    private resetHandler() {
        app.router.route("/");
    }

    private updateFilter = (event: Event) => {
        const formElement = document.getElementById("filters")! as HTMLFormElement;
        const formData = new FormData(formElement);
        const filterOptions = this.filterOptions;
        const element = event.target as HTMLInputElement;
        const name = element.name;
        const minPrice = document.getElementById("min-price") as HTMLInputElement;
        const maxPrice = document.getElementById("max-price") as HTMLInputElement;
        const minStock = document.getElementById("min-stock") as HTMLInputElement;
        const maxStock = document.getElementById("max-stock") as HTMLInputElement;
        switch (name) {
            case "category":
                filterOptions.categories = formData.getAll(name) as Array<string>;
                break;
            case "brand":
                filterOptions.brands = formData.getAll(name) as Array<string>;
                break;
            case "search":
                filterOptions.searchString = element.value;
                break;
            case "select":
                filterOptions.sortingString = element.value;
                break;
            case "min-price":
                filterOptions.minPrice = Number(minPrice!.value);
                filterOptions.maxPrice = Number(maxPrice!.value);
                break;
            case "max-price":
                filterOptions.minPrice = Number(minPrice!.value);
                filterOptions.maxPrice = Number(maxPrice!.value);
                break;
            case "min-stock":
                filterOptions.minStock = Number(minStock!.value);
                filterOptions.maxStock = Number(maxStock!.value);
                break;
            case "max-stock":
                filterOptions.minStock = Number(minStock!.value);
                filterOptions.maxStock = Number(maxStock!.value);
                break;
            case "display-mode":
                filterOptions.displayMode = String(element.value);
                break;
            default:
                break;
        }

        app.router.addQueryParameters(this.filterOptions);
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

    private workRangeInput(partOfId: string, minScope: number) {
        const lowerSlider = document.getElementById(`lower-${partOfId}`) as HTMLInputElement;
        const upperSlider = document.getElementById(`upper-${partOfId}`) as HTMLInputElement;
        const maxValue = document.getElementById(`max-${partOfId}`) as HTMLInputElement;
        const minValue = document.getElementById(`min-${partOfId}`) as HTMLInputElement;
        let lowerValue = parseInt(lowerSlider!.value);
        let upperValue = parseInt(upperSlider!.value);

        upperSlider.oninput = function () {
            lowerValue = parseInt(lowerSlider.value);
            upperValue = parseInt(upperSlider.value);

            if (upperValue < lowerValue + minScope) {
                lowerSlider.value = String(upperValue - minScope);
                maxValue.value = upperSlider.value;
                minValue.value = lowerSlider.value;
                if (lowerValue === Number(lowerSlider.min)) {
                    upperSlider.value = String(minScope);
                    maxValue.value = upperSlider.value;
                    minValue.value = lowerSlider.value;
                }
            }
            maxValue.value = upperSlider.value;
            minValue.value = lowerSlider.value;
        };

        lowerSlider.oninput = function () {
            lowerValue = parseInt(lowerSlider.value);
            upperValue = parseInt(upperSlider.value);

            if (lowerValue > upperValue - minScope) {
                upperSlider.value = String(lowerValue + minScope);
                maxValue.value = upperSlider.value;
                minValue.value = lowerSlider.value;
                if (upperValue === Number(upperSlider.max)) {
                    lowerSlider.value = String(parseInt(upperSlider.max) - minScope);
                    maxValue.value = upperSlider.value;
                    minValue.value = lowerSlider.value;
                }
            }
            maxValue.value = upperSlider.value;
            minValue.value = lowerSlider.value;
        };
    }

    private hideFilterByResizeWindow() {
        const filter = document.querySelector(".filter") as HTMLElement;
        if (document.body.clientWidth > 900 && filter.classList.contains("filter-show")) {
            filter.classList.remove("filter-show");
        }
    }
    private hideFilter() {
        const filter = document.querySelector(".filter") as HTMLElement;
        filter.classList.remove("filter-show");
    }
}
