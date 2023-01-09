import storeHtml from "./store.html";
import filterHtml from "./filter.html";
import "./store.css";
import "./filter.css";
import { Product } from "../../model/type/product";
import { app } from "../../..";
import StoreFilter from "../../model/storeFilterModel";
import { StoreFilterOptions } from "../../model/storeOptions";
import BurgerMenuImage from "../../../assets/img/Header/burger_menu.svg";
import Utils from "../common/utils";

export default class StoreView {
    private filterOptions: StoreFilterOptions;
    private storeHtmlTemplate: DocumentFragment;
    private filterHtmlTemplate: DocumentFragment;

    constructor() {
        this.filterOptions = new StoreFilterOptions();
        this.storeHtmlTemplate = document.createRange().createContextualFragment(storeHtml);
        this.filterHtmlTemplate = document.createRange().createContextualFragment(filterHtml);
    }
    public drawStore(options: StoreFilterOptions): void {
        this.filterOptions = options;
        const documentRoot = document.getElementById("root") as HTMLElement | null;
        if (!documentRoot) {
            return;
        }
        documentRoot.innerHTML = "";
        const storeWrapper = this.storeHtmlTemplate.querySelector(".store") as HTMLElement | null;
        if (!storeWrapper) {
            return;
        }
        documentRoot.append(storeWrapper);
        const burgerMenuImage = document.querySelector(".burger-menu__img") as HTMLImageElement | null;
        if (burgerMenuImage) {
            burgerMenuImage.src = BurgerMenuImage;
            burgerMenuImage.addEventListener("click", this.toggleFilter);
        }
        const popup = document.getElementById("popup-bg") as HTMLElement | null;
        if (popup) {
            popup.addEventListener("click", this.toggleFilter);
        }

        const activeProducts = app.store.updateFilterProducts(options);
        const filterWrapper = storeWrapper.querySelector(".filter") as HTMLElement | null;
        if (filterWrapper) {
            this.drawFilterSection(app.store.filter, filterWrapper);
        }
        this.drawProductsSection(activeProducts);
    }
    private updateStore = () => {
        const activeProducts = app.store.updateFilterProducts(this.filterOptions);
        this.updateProdcts(activeProducts);
        this.updateFilter(app.store.filter, this.filterOptions);
        app.router.addQueryParameters(this.filterOptions);
    };
    private drawProductsSection(products: Array<Product>) {
        const productsSectionWrapper = document.querySelector(".goods__output-wrapper") as HTMLElement | null;
        if (!productsSectionWrapper) {
            return;
        }
        productsSectionWrapper.addEventListener("click", this.productClickHandler);
        this.updateProdcts(products);
    }

    private updateProdcts(products: Array<Product>) {
        const productsSection = document.querySelector(".goods__output") as HTMLElement | null;
        if (!productsSection) {
            return;
        }
        productsSection.innerHTML = "";
        const productsCountSection = document.querySelector(".found__value") as HTMLElement | null;
        if (productsCountSection) {
            productsCountSection.innerHTML = `${products.length}`;
        }
        if (products.length === 0) {
            productsSection.innerHTML = "<h2 class='no-found'>No products found</h2>";
        }

        const productItemTemplate = this.storeHtmlTemplate.getElementById(
            "productItemTemp"
        ) as HTMLTemplateElement | null;
        if (!productItemTemplate) {
            return;
        }
        products.forEach((product) => {
            productsSection.append(this.drawProductItem(product, productItemTemplate));
        });
    }

    private drawProductItem(product: Product, template: HTMLTemplateElement): HTMLElement {
        const templateClone = template.content.cloneNode(true) as HTMLElement;
        const productItem = templateClone.querySelector(".product-item") as HTMLElement | null;
        if (productItem) {
            productItem.setAttribute("data-id", `${product.id}`);
            setTimeout(() => {
                productItem.style.backgroundImage = `url(${product.thumbnail})`;
            });
            const isProductInCart = app.cart.isProductInCart(product.id);
            if (isProductInCart) {
                const currentAddButton = templateClone.querySelector(".button-add") as HTMLElement;
                StoreView.styleProductCard("DROP FROM CART", currentAddButton);
            }
            if (this.filterOptions.displayMode === "6") productItem.classList.add("product-item_small");
        }
        Utils.setElementInnerHtml(templateClone, ".product-item__title", product.title);
        Utils.setElementInnerHtml(templateClone, ".info__row-category", product.category);
        Utils.setElementInnerHtml(templateClone, ".info__row-brand", product.brand);
        Utils.setElementInnerHtml(templateClone, ".info__row-price", `${product.price}`);
        Utils.setElementInnerHtml(templateClone, ".info__row-discount", `${product.discountPercentage}%`);
        Utils.setElementInnerHtml(templateClone, ".info__row-rating", `${product.rating}`);
        Utils.setElementInnerHtml(templateClone, ".info__row-stock", `${product.stock}`);

        return templateClone;
    }
    private drawFilterSection(filter: StoreFilter, wrapper: HTMLElement) {
        const filterSection = this.filterHtmlTemplate.querySelector(".filters-block") as HTMLElement | null;
        if (!filterSection) {
            return;
        }
        filterSection.addEventListener("input", this.updateStore);
        wrapper.append(filterSection);

        const closeFilterButton = filterSection.querySelector(".close-filter-button") as HTMLElement;
        closeFilterButton.addEventListener("click", this.toggleFilter);
        window.addEventListener("resize", this.hideFilterByResizeWindow);

        const checkBoxLineTemplate = this.filterHtmlTemplate.getElementById(
            "checkboxLine"
        ) as HTMLTemplateElement | null;
        if (!checkBoxLineTemplate) {
            return;
        }
        const resetButon = document.getElementById("reset") as HTMLElement | null;
        if (resetButon) {
            resetButon.addEventListener("click", this.resetHandler);
        }
        const copyLinkButon = document.getElementById("copy-link") as HTMLElement | null;
        if (copyLinkButon) {
            copyLinkButon.addEventListener("click", this.copyQueryStrigToClipboard);
        }
        const sortFieldset = document.getElementById("sort") as HTMLElement | null;
        if (sortFieldset) {
            sortFieldset.addEventListener("input", (e) => this.sortProducts(e));
        }
        const seacrchFieldset = document.getElementById("search") as HTMLInputElement | null;
        if (seacrchFieldset) {
            seacrchFieldset.addEventListener("input", () => this.searchProducts(seacrchFieldset.value));
        }
        const displayModeFieldset = document.getElementById("display-mode") as HTMLElement | null;
        if (displayModeFieldset) {
            displayModeFieldset.addEventListener("input", (e) => this.changeDisplayMode(e));
        }
        const filterForm = document.getElementById("filters-form") as HTMLFormElement | null;

        const categoryFilterSection = document.getElementById("category") as HTMLElement | null;
        if (categoryFilterSection && filterForm) {
            categoryFilterSection.addEventListener("input", () => this.selectCategory(filterForm));
            filter.categoryProducts.forEach((productByCategory) => {
                categoryFilterSection.append(Utils.fillInputLine(productByCategory, checkBoxLineTemplate));
            });
        }
        const brandFilterSection = document.getElementById("brand") as HTMLElement | null;
        if (brandFilterSection && filterForm) {
            brandFilterSection.addEventListener("input", () => this.selectBrand(filterForm));
            filter.brandProducts.forEach((productByBrand) => {
                brandFilterSection.append(Utils.fillInputLine(productByBrand, checkBoxLineTemplate));
            });
        }
        const priceFieldset = document.getElementById("price") as HTMLElement | null;
        if (priceFieldset) {
            priceFieldset.addEventListener("input", this.sliderInput.bind(this, "price", 100));
        }

        const stockFieldset = document.getElementById("stock") as HTMLElement | null;
        if (stockFieldset) {
            stockFieldset.addEventListener("input", this.sliderInput.bind(this, "stock", 8));
        }
        this.updateFilter(filter, this.filterOptions);
    }

    private sortProducts = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const sortValue = target.value;
        if (sortValue) {
            this.filterOptions.sortingString = sortValue;
        }
    };
    private searchProducts(searchValue: string) {
        this.filterOptions.searchString = searchValue;
    }

    private changeDisplayMode(e: Event) {
        const eventTarget = e.target as HTMLInputElement;
        if (!eventTarget.matches("input[type=radio]")) {
            return;
        }
        const displayModeValue = eventTarget.value;
        this.filterOptions.displayMode = displayModeValue;
    }
    private selectCategory(formElement: HTMLFormElement) {
        const formData = new FormData(formElement);
        this.filterOptions.categories = formData.getAll("category") as Array<string>;
    }
    private selectBrand(formElement: HTMLFormElement) {
        const formData = new FormData(formElement);
        this.filterOptions.brands = formData.getAll("brand") as Array<string>;
    }
    private productClickHandler(event: Event): void {
        const clickedElement = event.target as HTMLElement;
        const parentProductItemSection = clickedElement.closest(".product-item") as HTMLElement | null;
        if (!parentProductItemSection) {
            return;
        }
        const productIdStr = parentProductItemSection.getAttribute("data-id");
        if (!productIdStr) {
            return;
        }
        const productId = Number.parseInt(productIdStr);
        if (!productId) {
            return;
        }
        const findedProduct = app.store.products.find((product) => product.id === productId);
        if (!findedProduct) {
            return;
        }
        if (clickedElement.classList.contains("button-details")) {
            app.router.route(`/product/${productId}`);
        }
        if (clickedElement.classList.contains("button-add")) {
            StoreView.styleProductCard("DROP FROM CART", clickedElement);
            app.cart.putProductIntoCart(findedProduct);
            app.header.drawHeader(app.cart);
        } else if (clickedElement.classList.contains("button-drop")) {
            StoreView.styleProductCard("ADD TO CART", clickedElement);
            app.cart.dropProductFromCart(+productId);
            app.header.drawHeader(app.cart);
        }
    }

    //     const burgerMenuImage = document.querySelector(".burger-menu__img")! as HTMLImageElement;
    //     burgerMenuImage.src = BurgerMenuImage;

    //     burgerMenuImage.addEventListener("click", this.drawBurgerMenuFilter);
    //     stockFieldSet!.addEventListener("input", this.workRangeInput.bind(this, "stock", 8));
    //     priceFieldSet!.addEventListener("input", this.workRangeInput.bind(this, "price", 100));
    // }

    private resetHandler() {
        app.router.route("/");
    }

    private updateFilter(filter: StoreFilter, filterOptions: StoreFilterOptions) {
        const filterSection = document.querySelector(".filters-block") as HTMLElement | null;
        if (!filterSection) {
            return;
        }
        const search = document.getElementById("search") as HTMLInputElement | null;
        if (search) {
            search.value = filterOptions.searchString;
        }

        const displayModeFieldset = filterSection.querySelector(".display-mode") as HTMLElement | null;
        if (displayModeFieldset) {
            const radioButtons = document.querySelectorAll("input[type='radio']") as NodeListOf<Element>;
            const tempRadioButtons = Array.from(radioButtons) as Array<HTMLInputElement>;
            let radioChecked = tempRadioButtons.find((radiobtn) => radiobtn.value === filterOptions.displayMode);
            if (!radioChecked) {
                radioChecked = tempRadioButtons[0];
                if (radioChecked) {
                    radioChecked.checked = true;
                }
            } else {
                radioChecked.checked = true;
            }
        }

        const sortFieldset = filterSection.querySelector(".sort") as HTMLElement | null;
        if (sortFieldset) {
            const sortOptions = sortFieldset.querySelectorAll("option") as NodeListOf<HTMLElement>;
            const tempSelectTagOptions = Array.from(sortOptions) as HTMLOptionElement[];
            let selectedOption = tempSelectTagOptions.find((option) => option.value === filterOptions.sortingString);
            if (!selectedOption) {
                selectedOption = tempSelectTagOptions[0];
                if (selectedOption) {
                    selectedOption.selected = true;
                }
            } else {
                selectedOption.selected = true;
            }
        }

        const categoryFilterSection = filterSection.querySelector("fieldset.category") as HTMLFieldSetElement | null;
        if (categoryFilterSection) {
            const categoryCheckboxesLines = Array.from(
                categoryFilterSection.querySelectorAll(".checkbox-line")
            ) as Array<HTMLElement>;
            categoryCheckboxesLines.forEach((checkboxLine, index) => {
                const checkbox = checkboxLine.querySelector(".checkbox-line__input") as HTMLInputElement | null;
                const checkboxSpan = checkboxLine.querySelector(
                    ".checkbox-line__product-quantity"
                ) as HTMLInputElement | null;
                if (checkbox && checkboxSpan) {
                    const filterCategoryProduct = filter.categoryProducts[index];
                    if (filterCategoryProduct) {
                        if (
                            this.filterOptions.categories.find(
                                (category) => category === filterCategoryProduct.category
                            )
                        ) {
                            checkbox.checked = true;
                        }
                        checkboxSpan.innerHTML = `${filterCategoryProduct.activeProducts}/${filterCategoryProduct.totalProducts}`;
                    }
                }
            });
        }

        const brandFilterSection = filterSection.querySelector("fieldset.brand") as HTMLFieldSetElement | null;
        if (brandFilterSection) {
            const brandCheckboxesLines = Array.from(
                brandFilterSection.querySelectorAll(".checkbox-line")
            ) as Array<HTMLElement>;
            brandCheckboxesLines.forEach((checkboxLine, index) => {
                const checkbox = checkboxLine.querySelector(".checkbox-line__input") as HTMLInputElement | null;
                const checkboxSpan = checkboxLine.querySelector(
                    ".checkbox-line__product-quantity"
                ) as HTMLInputElement | null;
                if (checkbox && checkboxSpan) {
                    const filterBrandProduct = filter.brandProducts[index];
                    if (filterBrandProduct) {
                        if (this.filterOptions.brands.find((brand) => brand === filterBrandProduct.brand)) {
                            checkbox.checked = true;
                        }
                        checkboxSpan.innerHTML = `${filterBrandProduct.activeProducts}/${filterBrandProduct.totalProducts}`;
                    }
                }
            });
        }

        this.checkAndSetRangeValues(filter.minPrice, "#min-price", filterSection);
        this.checkAndSetRangeValues(filter.maxPrice, "#max-price", filterSection);
        this.checkAndSetRangeValues(filter.minStock, "#min-stock", filterSection);
        this.checkAndSetRangeValues(filter.maxStock, "#max-stock", filterSection);

        Utils.setInputValue(filterSection, "#lower-price", `${filter.minPrice}`);
        Utils.setInputValue(filterSection, "#upper-price", `${filter.maxPrice}`);
        Utils.setInputValue(filterSection, "#lower-stock", `${filter.minStock}`);
        Utils.setInputValue(filterSection, "#upper-stock", `${filter.maxStock}`);
    }

    private checkAndSetRangeValues(inputRangeValue: Number, inputRangeId: string, filterSection: HTMLElement) {
        if (Number.isFinite(inputRangeValue)) {
            Utils.setInputValue(filterSection, inputRangeId, `${inputRangeValue}`);
        } else {
            Utils.setInputValue(filterSection, inputRangeId, "Not found");
        }
    }

    private sliderInput(sliderId: string, minScope: number) {
        const minValue = document.getElementById(`min-${sliderId}`) as HTMLInputElement;
        const maxValue = document.getElementById(`max-${sliderId}`) as HTMLInputElement;
        const lowerSlider = document.getElementById(`lower-${sliderId}`) as HTMLInputElement;
        const upperSlider = document.getElementById(`upper-${sliderId}`) as HTMLInputElement;

        upperSlider.oninput = () => {
            const lowerValue = parseInt(lowerSlider.value);
            const upperValue = parseInt(upperSlider.value);
            if (upperValue < lowerValue + minScope) {
                upperSlider.value = `${lowerValue + minScope}`;
                console.log(upperSlider.value);
            }
            maxValue.value = upperSlider.value;
            minValue.value = lowerSlider.value;
            if (sliderId === "price") {
                this.filterOptions.maxPrice = Number(maxValue.value);
            }
            if (sliderId === "stock") {
                this.filterOptions.maxStock = Number(maxValue.value);
            }
        };

        lowerSlider.oninput = () => {
            const lowerValue = parseInt(lowerSlider.value);
            const upperValue = parseInt(upperSlider.value);

            if (lowerValue > upperValue - minScope) {
                lowerSlider.value = String(upperValue - minScope);
            }
            maxValue.value = upperSlider.value;
            minValue.value = lowerSlider.value;
            if (sliderId === "price") {
                this.filterOptions.minPrice = Number(minValue.value);
            }
            if (sliderId === "stock") {
                this.filterOptions.minStock = Number(minValue.value);
            }
        };
    }

    public static styleProductCard(textContent: string, clickedButton: HTMLElement): void {
        const articleElem = clickedButton.closest(".product-item") as HTMLElement;
        clickedButton.classList.toggle("button-add");
        clickedButton.classList.toggle("button-drop");
        articleElem.classList.toggle("product-item_added");
        clickedButton.textContent = textContent;
    }

    private hideFilterByResizeWindow() {
        const filter = document.querySelector(".filter") as HTMLElement;
        const spaBody = document.getElementById("spa-body") as HTMLBodyElement;
        const popupBg = document.getElementById("popup-bg") as HTMLDivElement;
        if (document.body.clientWidth > 991 && filter && spaBody && popupBg) {
            popupBg.classList.remove("popup-bg_active");
            spaBody.classList.remove("spa-body_active");
            filter.classList.remove("filter-show");
        }
    }

    private toggleFilter() {
        const filter = document.querySelector(".filter") as HTMLElement;
        const spaBody = document.getElementById("spa-body") as HTMLBodyElement;
        const popupBg = document.getElementById("popup-bg") as HTMLDivElement;
        popupBg.classList.toggle("popup-bg_active");
        spaBody.classList.toggle("spa-body_active");
        filter.classList.toggle("filter-show");
    }

    private copyQueryStrigToClipboard(event: Event) {
        event.preventDefault();
        const clickedElement = event.target as HTMLElement;
        app.router.copyQueryParametersToClipBoard();
        clickedElement.textContent = "LINK COPIED!";
        setTimeout(() => (clickedElement.textContent = "COPY LINK"), 1500);
    }
}
