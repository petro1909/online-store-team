import { CategoryProducts, BrandProducts } from "../../model/storeFilterModel";

export default class Utils {
    public static isCategoryProdct(product: CategoryProducts | BrandProducts): product is CategoryProducts {
        return (product as CategoryProducts).category !== undefined;
    }
    public static fillInputLine(
        commonProduct: CategoryProducts | BrandProducts,
        template: HTMLTemplateElement
    ): HTMLElement {
        const templateClone = template.content.cloneNode(true) as HTMLElement;
        const checkboxInput = templateClone.querySelector(".checkbox-line__input") as HTMLElement;
        const checkboxLabel = templateClone.querySelector(".checkbox-line__label") as HTMLElement;
        const checkboxProductQuantity = templateClone.querySelector(".checkbox-line__product-quantity") as HTMLElement;
        if (this.isCategoryProdct(commonProduct)) {
            checkboxInput.setAttribute("id", `${commonProduct.category}`);
            checkboxInput.setAttribute("value", `${commonProduct.category}`);
            checkboxInput.setAttribute("name", "category");
            checkboxLabel.setAttribute("for", `${commonProduct.category}`);
            checkboxLabel.innerHTML = `${commonProduct.category}`;
            checkboxProductQuantity.classList.add("category-product");
        } else {
            checkboxInput.setAttribute("id", `${commonProduct.brand}`);
            checkboxInput.setAttribute("value", `${commonProduct.brand}`);
            checkboxInput.setAttribute("name", "brand");
            checkboxLabel.setAttribute("for", `${commonProduct.brand}`);
            checkboxLabel.innerHTML = `${commonProduct.brand}`;
            checkboxProductQuantity.classList.add("brand-product");
        }
        checkboxProductQuantity.innerHTML = `${commonProduct.activeProducts}/${commonProduct.totalProducts}`;
        return templateClone;
    }

    public static setElementInnerHtml(parentElement: HTMLElement, selector: string, value: string): void {
        const element = parentElement.querySelector(selector) as HTMLElement;
        if (!element) {
            return;
        }
        element.innerHTML = value;
    }

    public static setInputValue(parentElement: HTMLElement, selector: string, value: string): void {
        const element = parentElement.querySelector(selector) as HTMLInputElement;
        if (!element) {
            return;
        }
        element.value = value;
    }
}
