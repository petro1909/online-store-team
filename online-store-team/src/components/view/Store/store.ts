/* eslint-disable @typescript-eslint/no-non-null-assertion */
import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";
import "./filter.css";
import { Product } from "../../model/type/IProduct";
import { app } from "../../..";
import StoreFilter from "../../model/StoreFilter";
import { StoreFilterOptions } from "../../model/type/IFilterOptions";
import BurgerMenuImage from "../../../assets/img/Header/burger_menu.svg";

export default class StoreView {
    private filterOptions: StoreFilterOptions = new StoreFilterOptions();

    public drawStore(options: StoreFilterOptions): void {
        this.filterOptions = options;
        document.getElementById("root")!.innerHTML = storeHtml;

        const activeProducts = app.store.updateFilterProducts(options);
        this.drawProducts(activeProducts);

        const filter = app.store.getFilter();
        // console.log("filter =", filter);
        this.drawFilter(filter, this.filterOptions);
        this.makeFilterActual(filter, this.filterOptions);
    }

    private drawProducts(products: Array<Product>) {
        //console.log("drawProducts =", products);

        document.querySelector(".goods__output")!.innerHTML = "";
        document.querySelector(".found__value")!.innerHTML = `${products.length}`;
        if(products.length === 0) document.querySelector(".goods__output")!.innerHTML = "<h2>No products found</h2>";

        const productItemTemplate = document.getElementById("productItemTemp") as HTMLTemplateElement;
        const fragment: DocumentFragment = document.createDocumentFragment();

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

    private drawFilter(filter: StoreFilter, filterOptions: StoreFilterOptions) {
        console.log("drawFilter");
        // console.log("filter =", filter);
        const filterSection = document.querySelector(".filter");
        filterSection!.insertAdjacentHTML("beforeend", filterHtml);

        const closeFilterButton = filterSection?.querySelector(".close-filter-button") as HTMLElement;
        closeFilterButton.addEventListener("click", this.hideFilter);
        window.addEventListener("resize", this.hideFilterByResizeWindow);
        const category = document.getElementById("category")!;
        const brand = document.getElementById("brand")!;

        // TODO refactor put in a separate function
        filter.categoryProducts.forEach((item) => {
            let attrChecked = "";
            if(filterOptions.categories.includes(item.category)) {attrChecked = "checked";}
            category.innerHTML += `<div class="checkbox-line checkbox-active">
                                    <input class="checkbox"
                                    type="checkbox" id="${item.category}"
                                    value="${item.category}"
                                    name="category"
                                    ${attrChecked}>
                                    <label for="${item.category}">${item.category}</label>
                                    <span class="category-product">${item.activeProducts}/${item.totalProducts}</span>
                                </div>`;
        });
        filter.brandProducts.forEach((item) => {
            let attrChecked = "";
            if(filterOptions.brands.includes(item.brand)) {attrChecked = "checked";}
            brand.innerHTML += `<div class="checkbox-line checkbox-active">
                                    <input class="checkbox"
                                    type="checkbox"
                                    id="${item.brand}"
                                    value="${item.brand}"
                                    name="brand"
                                    ${attrChecked}>
                                    <label for="${item.brand}">${item.brand}</label>
                                    <span class="brand-product">${item.activeProducts}/${item.totalProducts}</span>
                                </div>`;
        });

        const minPrice = document.getElementById("min-price")! as HTMLInputElement;
        const maxPrice = document.getElementById("max-price")! as HTMLInputElement;
        const minStock = document.getElementById("min-stock")! as HTMLInputElement;
        const maxStock = document.getElementById("max-stock")! as HTMLInputElement;

        const lowerPrice = document.getElementById("lower-price")! as HTMLInputElement;
        const upperPrice = document.getElementById("upper-price")! as HTMLInputElement;
        const lowerStock = document.getElementById("lower-stock")! as HTMLInputElement;
        const upperStock = document.getElementById("upper-stock")! as HTMLInputElement;

        minPrice.value = String(filter.minPrice);
        maxPrice.value = String(filter.maxPrice);
        minStock.value = String(filter.minStock);
        maxStock.value = String(filter.maxStock);

        lowerPrice.value = String(filter.minPrice);
        upperPrice.value = String(filter.maxPrice);
        lowerStock.value = String(filter.minStock);
        upperStock.value = String(filter.maxStock);

        filterSection!.addEventListener("input", this.updateFilter);
        filterSection!.addEventListener("reset", this.resetHandler);

        const stockFieldSet = document.getElementById("stock");
        const priceFieldSet = document.getElementById("price");
        const burgerMenuImage = document.querySelector(".burger-menu__img")! as HTMLImageElement;
        burgerMenuImage.src = BurgerMenuImage;

        burgerMenuImage.addEventListener("click", this.drawBurgerMenuFilter);
        stockFieldSet!.addEventListener("input", this.workRangeInput.bind(this, "stock", 8));
        priceFieldSet!.addEventListener("input", this.workRangeInput.bind(this, "price", 100));
        console.log("\n");
    }

    private resetHandler() {
        app.router.route("/");
    }

    private updateFilter = (event: Event) => {

        console.log("updateFilter");

        const formElement = document.getElementById("filters")! as HTMLFormElement;
        const formData = new FormData(formElement);
        const filterOptions = this.filterOptions;

        const element = event.target as HTMLInputElement;
        const name = element.name;

        const minPrice = document.getElementById("min-price") as HTMLInputElement;
        const maxPrice = document.getElementById("max-price") as HTMLInputElement;
        const minStock = document.getElementById("min-stock") as HTMLInputElement;
        const maxStock = document.getElementById("max-stock") as HTMLInputElement;

        const lowerPrice = document.getElementById("lower-price")! as HTMLInputElement;
        const upperPrice = document.getElementById("upper-price")! as HTMLInputElement;
        const lowerStock = document.getElementById("lower-stock")! as HTMLInputElement;
        const upperStock = document.getElementById("upper-stock")! as HTMLInputElement;

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

        const activeProducts = app.store.updateFilterProducts(filterOptions);
        const filter = app.store.getFilter();

        minPrice.value = String(filter.minPrice);
        maxPrice.value = String(filter.maxPrice);
        minStock.value = String(filter.minStock);
        maxStock.value = String(filter.maxStock);

        lowerPrice.value = String(filter.minPrice);
        upperPrice.value = String(filter.maxPrice);
        lowerStock.value = String(filter.minStock);
        upperStock.value = String(filter.maxStock);

        this.drawProducts(activeProducts);
        this.makeFilterActual(filter, filterOptions);
        console.log("\n");
        app.router.addQueryParameters(this.filterOptions);
    };

    private workRangeInput(partOfId: string, minScope: number, event: Event) {
        // console.log("workRangeInput");
        const lowerSlider = document.getElementById(`lower-${partOfId}`) as HTMLInputElement;
        const upperSlider = document.getElementById(`upper-${partOfId}`) as HTMLInputElement;
        const maxValue = document.getElementById(`max-${partOfId}`) as HTMLInputElement;
        const minValue = document.getElementById(`min-${partOfId}`) as HTMLInputElement;
        let lowerValue = parseInt(lowerSlider!.value);
        let upperValue = parseInt(upperSlider!.value);

        upperSlider.oninput = function() {
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


        lowerSlider.oninput = function() {
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
    };

    private makeFilterActual(filter: StoreFilter, filterOptions: StoreFilterOptions) {
        console.log("makeFilterActual");

        console.log("filter =", filter);

        const search = document.getElementById("search")! as HTMLInputElement;
        search.value = filterOptions.searchString;

        // TODO refactor put in a separate function
        const radioButtons = document.querySelectorAll(".radio")! as NodeListOf<Element>;
        const tempRadioButtons = Array.from(radioButtons) as HTMLInputElement[];
        const radioChecked = tempRadioButtons.find(radiobtn => {return radiobtn.value === filterOptions.displayMode ? true : false;});
        radioButtons.forEach(radiobtn => {radiobtn.removeAttribute("checked");});
        radioChecked?.setAttribute("checked", "checked");
        if(filterOptions.displayMode === "") tempRadioButtons[0]?.setAttribute("checked", "checked");

        const selectTagOptions = document.querySelectorAll(".option")! as NodeListOf<Element>;
        const tempSelectTagOptions = Array.from(selectTagOptions) as HTMLOptionElement[];
        const selectedOption = tempSelectTagOptions.find(option => {return option.value === filterOptions.sortingString ? true : false;});
        selectTagOptions.forEach(option => {option.removeAttribute("selected");});
        selectedOption?.setAttribute("selected", "selected");

        // TODO refactor put in a separate function
        const categoryCheckboxes = document.querySelectorAll(".category-product") as NodeListOf<Element>;
        const tempCategoryCheckboxes = Array.from(categoryCheckboxes) as HTMLSpanElement[];
        tempCategoryCheckboxes.forEach((checkbox, index) => {
            checkbox.textContent = `${filter.categoryProducts[index]?.activeProducts}/${filter.categoryProducts[0]?.totalProducts}`;
        })
        console.log("categoryCheckboxes =", categoryCheckboxes);

        const brandCheckboxes = document.querySelectorAll(".brand-product") as NodeListOf<Element>;
        const tempBrandCheckboxes = Array.from(brandCheckboxes) as HTMLSpanElement[];
        tempBrandCheckboxes.forEach((checkbox, index) => {
            checkbox.textContent = `${filter.brandProducts[index]?.activeProducts}/${filter.brandProducts[0]?.totalProducts}`;
        })
        console.log("brandCheckboxes =", brandCheckboxes);

        console.log("\n");
    }

    public static styleProductCard(textContent: string, clickedButton: HTMLElement): void {
        const articleElem = clickedButton.closest(".product-item")!;
        clickedButton.classList.toggle("button-add");
        clickedButton.classList.toggle("button-drop");
        articleElem.classList.toggle("product-item_added");
        clickedButton.textContent = textContent;
    }

    private drawBurgerMenuFilter() {
        const filter = document.querySelector(".filter") as HTMLElement;
        const spaBody = document.getElementById("spa-body") as HTMLBodyElement;
        const popupBg = document.getElementById("popup-bg")! as HTMLDivElement;
        popupBg.onclick = () => {
            popupBg!.classList.remove("popup-bg_active");
            spaBody!.classList.remove("spa-body_active");
            filter!.classList.remove("filter-show");
        };
        popupBg.classList.add("popup-bg_active");
        spaBody.classList.add("spa-body_active");
        filter!.classList.add("filter-show");
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
