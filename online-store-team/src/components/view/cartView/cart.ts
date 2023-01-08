/* eslint-disable @typescript-eslint/no-non-null-assertion */
import cartHtml from "./cart.html";
import "./cart.css";
import Cart from "../../model/cartModel";
import OrderView from "../orderView/order";
import { CartProduct } from "../../model/type/cartProduct";
import { app } from "../../../index";
import { CartOptions } from "../../model/storeOptions";
import { IPromocode } from "../../model/type/promocode";

export default class CartView {
    private cartOptions: CartOptions;
    private cartHtmlTemplate: DocumentFragment;
    constructor() {
        this.cartOptions = new CartOptions();
        this.cartHtmlTemplate = document.createRange().createContextualFragment(cartHtml);
    }
    public drawCart(cartOptions: CartOptions): void {
        this.cartOptions = app.cart.validateCartOptions(cartOptions);
        app.router.replaceQueryParameters(this.cartOptions);

        const documentRoot = document.getElementById("root");
        if (!documentRoot) {
            return;
        }
        documentRoot.innerHTML = "";
        const cartWrapperSection = this.cartHtmlTemplate.querySelector(".cart") as HTMLElement | null;
        if (!cartWrapperSection) {
            return;
        }
        documentRoot.append(cartWrapperSection);
        this.drawCartHeader();
        this.drawCartProducts();
        this.drawSummary();
    }

    private drawCartHeader() {
        const cartHeaderSection = document.querySelector(".content__pagination") as HTMLElement | null;
        if (!cartHeaderSection) {
            return;
        }
        const cartPaginationSection = cartHeaderSection.querySelector(".pagination__page-number") as HTMLElement | null;
        if (cartPaginationSection) {
            cartPaginationSection.addEventListener("click", this.changeCartPage);
        }
        const pageProductLimitInput = document.getElementById("pagination-limit-input") as HTMLInputElement | null;
        if (pageProductLimitInput) {
            pageProductLimitInput.addEventListener("change", this.updateCartProductLimit);
        }
        this.updateCartHeader();
    }

    private updateCartHeader() {
        const currentPage = document.getElementById("pagination-page-current") as HTMLElement | null;
        if (currentPage) {
            currentPage.innerHTML = `${this.cartOptions.page}`;
        }
        const pageProductLimitInput = document.getElementById("pagination-limit-input") as HTMLInputElement | null;
        if (pageProductLimitInput) {
            pageProductLimitInput.value = `${this.cartOptions.limit}`;
        }
    }

    private updateCartProductLimit = (e: Event) => {
        const productLimitInput = e.target as HTMLInputElement;
        const productPageLimit = Number.parseInt(productLimitInput.value);

        if (!productPageLimit) {
            productLimitInput.value = `${this.cartOptions.limit}`;
            return;
        }
        if (productPageLimit === this.cartOptions.limit) {
            return;
        }
        if (productPageLimit < 1) {
            this.cartOptions.limit = 1;
        } else if (productPageLimit > app.cart.cartProducts.length) {
            this.cartOptions.limit = app.cart.cartProducts.length;
        } else {
            this.cartOptions.limit = productPageLimit;
        }
        this.updateCartHeader();
        this.updateCartProducts();
        app.router.addQueryParameters(this.cartOptions);
    };

    private changeCartPage = (e: Event) => {
        const clickedButton = e.target as HTMLElement | null;
        if (!clickedButton) {
            return;
        }
        let currPage = this.cartOptions.page;
        if (clickedButton.classList.contains("pagination__page-prev")) {
            currPage--;
        } else if (clickedButton.classList.contains("pagination__page-next")) {
            currPage++;
        }
        let pagesCount = Math.ceil(app.cart.cartProducts.length / this.cartOptions.limit);
        if (Number.isNaN(pagesCount)) {
            pagesCount = 0;
        }
        if (currPage < 1 || currPage > pagesCount) {
            return;
        }
        this.cartOptions.page = currPage;
        this.updateCartHeader();
        this.updateCartProducts();
        app.router.addQueryParameters(this.cartOptions);
    };

    private drawCartProducts() {
        const cartProductsWrapperSection = document.querySelector(".content__container") as HTMLElement;
        if (!cartProductsWrapperSection) {
            return;
        }
        cartProductsWrapperSection.addEventListener("click", this.cartProductHandlers);
        this.updateCartProducts();
    }

    private updateCartProducts() {
        const cartProductsSection = document.querySelector(".cart-items") as HTMLElement;
        if (!cartProductsSection) {
            return;
        }
        const productItemWrapperSection = this.cartHtmlTemplate.getElementById(
            "cartItemTemplate"
        ) as HTMLTemplateElement;
        cartProductsSection.innerHTML = "";

        const activeCartProducts = app.cart.updateCartProducts(this.cartOptions);
        if (activeCartProducts.length === 0) {
            const noCartItemPlaceholder = document.createElement("div");
            noCartItemPlaceholder.innerHTML = "There is no products in cart";
            cartProductsSection.append(noCartItemPlaceholder);
        }

        activeCartProducts.forEach((cartProduct) => {
            cartProductsSection.append(this.drawCartProcuct(cartProduct, productItemWrapperSection));
        });
    }

    private drawCartProcuct(cartProduct: CartProduct, template: HTMLTemplateElement): HTMLElement {
        const product = cartProduct.product;
        const cartProductSection = template.content.cloneNode(true) as HTMLElement;

        const cartItem = cartProductSection.querySelector(".cart-item") as HTMLElement | null;
        if (cartItem) {
            cartItem.setAttribute("data-id", String(product.id));
        }
        const productImg = cartProductSection.querySelector(".product__img") as HTMLImageElement | null;
        if (productImg) {
            productImg.src = String(product.images[0]);
            productImg.alt = product.title;
            productImg.loading = "lazy";
        }
        this.SetElementInnerHtml(cartProductSection, ".cart-item__number", `${cartProduct.cartIndex}`);
        this.SetElementInnerHtml(cartProductSection, ".product__desc-title", product.title);
        this.SetElementInnerHtml(cartProductSection, ".product__desc-text", product.description);
        this.SetElementInnerHtml(cartProductSection, ".product__desc-rating", `Rating: ${product.rating}`);
        this.SetElementInnerHtml(
            cartProductSection,
            ".product__desc-discount",
            `Discount: ${product.discountPercentage}%`
        );
        this.SetElementInnerHtml(cartProductSection, ".cart-item__stock", `Stock: ${product.stock}`);
        this.SetElementInnerHtml(cartProductSection, ".cart-item__quantity", `${cartProduct.count}`);
        this.SetElementInnerHtml(cartProductSection, ".cart-item__amount-control", `€${cartProduct.totalPrice}`);
        return cartProductSection;
    }

    private cartProductHandlers = (e: MouseEvent) => {
        const eventTarget = e.target as HTMLElement;
        const cartItemSectrion = eventTarget.closest(".cart-item");
        if (!cartItemSectrion) return;
        const productIdStr = cartItemSectrion.getAttribute("data-id");
        if (!productIdStr) return;
        const productId = Number.parseInt(productIdStr);
        if (!productId) return;

        if (eventTarget.closest(".cart-item") && !eventTarget.classList.contains("btn")) {
            app.router.route("product/" + productId);
            return;
        }
        if (eventTarget.classList.contains("cart-item__decrease-btn")) {
            if (!app.cart.decreaceCartProductCount(productId)) {
                return;
            }
            const tempCartOptions = app.cart.validateCartOptions(this.cartOptions);
            if (tempCartOptions.page !== this.cartOptions.page) {
                this.cartOptions.page = tempCartOptions.page;
                this.cartOptions.limit = tempCartOptions.limit;
                this.updateCartHeader();
                app.router.replaceQueryParameters(this.cartOptions);
            }
        }
        if (eventTarget.classList.contains("cart-item__increase-btn")) {
            if (!app.cart.increaceCartProductCount(productId)) {
                return;
            }
        }
        if (eventTarget.classList.contains("btn")) {
            app.header.drawHeader(app.cart);
            this.updateSummary();
            this.updateCartProducts();
        }
    };

    private drawSummary = () => {
        const summary = document.querySelector(".summary") as HTMLElement | null;
        if (!summary) {
            return;
        }

        const proposedPromocodeSection = summary.querySelector(".summary__proposed-promo-codes") as HTMLElement | null;
        if (!proposedPromocodeSection) {
            return;
        }

        const usedPromocodesSection = summary.querySelector(".summary__used-promo-codes") as HTMLElement | null;
        if (usedPromocodesSection) {
            const usedPromocodesListSection = usedPromocodesSection.querySelector(
                ".summary__used-promo-codes-list"
            ) as HTMLElement | null;
            if (usedPromocodesListSection) {
                proposedPromocodeSection.addEventListener("click", (e) =>
                    this.setPromocode(e, usedPromocodesListSection)
                );
                usedPromocodesListSection.addEventListener("click", this.removePromocode);
                app.cart.usedPromocodes.forEach((promocode) => {
                    usedPromocodesListSection.append(this.createPromocodeSection(promocode, "DROP"));
                });
            }
            if (app.cart.usedPromocodes.length === 0) {
                usedPromocodesSection.style.display = "none";
            }
        }

        const summaryPromocodeInput = summary.querySelector(".summary__input-promo") as HTMLInputElement | null;
        if (summaryPromocodeInput) {
            summaryPromocodeInput.addEventListener("input", () =>
                this.findPromocode(proposedPromocodeSection, summaryPromocodeInput.value)
            );
        }

        const allPromocodesSection = document.querySelector(".summary__all-promo-codes") as HTMLElement | null;
        if (allPromocodesSection) {
            allPromocodesSection.innerHTML =
                "Promocodes for test: <br>" + Cart.promocodes.map((promocode: IPromocode) => promocode.text).join(", ");
        }

        const summarySumbit = summary.querySelector(".summary__submit") as HTMLElement | null;
        if (summarySumbit) {
            summarySumbit.addEventListener("click", this.drawOrder);
        }
        this.updateSummary();
    };

    private updateSummary() {
        const summary = document.querySelector(".summary") as HTMLElement | null;
        if (!summary) {
            return;
        }
        this.SetElementInnerHtml(summary, ".summary__products-value", `${app.cart.totalCount}`);
        this.SetElementInnerHtml(summary, ".summary__total-value", `${app.cart.totalPrice}`);
        const cartActualTotalPrice = document.querySelector(".summary__actual-total-value") as HTMLElement | null;
        if (cartActualTotalPrice) {
            cartActualTotalPrice.innerHTML = `${app.cart.actualPrice}`;
        }
        const usedPromoCodesSection = document.querySelector(".summary__used-promo-codes") as HTMLElement | null;
        const cartTotalPriceSection = document.querySelector(".summary__total-text") as HTMLElement | null;
        const cartActualTotalPriceSection = document.querySelector(".summary__actual-total-text") as HTMLElement | null;
        if (usedPromoCodesSection) {
            if (app.cart.usedPromocodes.length === 0) {
                usedPromoCodesSection.style.display = "none";
            } else {
                usedPromoCodesSection.style.display = "block";
            }
        }
        if (cartTotalPriceSection) {
            if (app.cart.usedPromocodes.length === 0) {
                cartTotalPriceSection.style.textDecoration = "none";
            } else {
                cartTotalPriceSection.style.textDecoration = "line-through";
            }
        }
        if (cartActualTotalPriceSection) {
            if (app.cart.usedPromocodes.length === 0) {
                cartActualTotalPriceSection.style.display = "none";
            } else {
                cartActualTotalPriceSection.style.display = "block";
            }
        }
    }

    public drawOrder = () => {
        const orderView = new OrderView();
        orderView.drawOrder();
    };

    private findPromocode(parentElement: HTMLElement, value: string) {
        parentElement.innerHTML = "";
        const findedPromocode = Cart.promocodes.find((promocode) => value === promocode.text);
        if (!findedPromocode) {
            return;
        }
        parentElement.append(this.createPromocodeSection(findedPromocode, "ADD"));
        this.updateProposedPromocodeButtonSection();
    }

    private setPromocode = (e: MouseEvent, parentElement: HTMLElement) => {
        const promocodeTuple = this.getPromocodeSecionAndId(e);
        if (!promocodeTuple) return;

        const findedPromocode = app.cart.setPromocode(promocodeTuple.promocodeId);
        if (!findedPromocode) {
            return;
        }

        parentElement.append(this.createPromocodeSection(findedPromocode, "DROP"));
        this.updateProposedPromocodeButtonSection();
        this.updateSummary();
    };

    private removePromocode = (e: MouseEvent) => {
        const promocodeTuple = this.getPromocodeSecionAndId(e);
        if (!promocodeTuple) return;

        const findedPromocode = app.cart.removePromocode(promocodeTuple.promocodeId);
        if (!findedPromocode) {
            return;
        }
        promocodeTuple.section.remove();
        this.updateProposedPromocodeButtonSection();
        this.updateSummary();
    };

    private getPromocodeSecionAndId(e: MouseEvent): { section: HTMLElement; promocodeId: string } | undefined {
        const eventTarget = e.target as HTMLElement;
        if (!eventTarget.classList.contains("promo-code__action")) return;

        const promocodeSection = eventTarget.closest(".promo-code") as HTMLElement | null;
        if (!promocodeSection) return;

        const id = promocodeSection.getAttribute("id") as string | null;
        if (!id) return;
        return { section: promocodeSection, promocodeId: id };
    }

    private createPromocodeSection(promocode: IPromocode, buttonText: string): HTMLElement {
        const proposedPromocodeTemplate = this.cartHtmlTemplate.getElementById(
            "promo-codeTemplate"
        ) as HTMLTemplateElement;
        const proposedPromocodeTemplateClone = proposedPromocodeTemplate.content.cloneNode(true) as HTMLTemplateElement;
        const proposedPromocodeSection = proposedPromocodeTemplateClone.querySelector(
            ".promo-code"
        ) as HTMLElement | null;
        if (proposedPromocodeSection) {
            proposedPromocodeSection.setAttribute("id", promocode.text);
            this.SetElementInnerHtml(proposedPromocodeSection, ".promo-code__name", promocode.text);
            this.SetElementInnerHtml(proposedPromocodeSection, ".promo-code__discount", `${promocode.discount}%`);
            this.SetElementInnerHtml(proposedPromocodeSection, ".promo-code__action", buttonText);
        }
        return proposedPromocodeTemplateClone;
    }

    private updateProposedPromocodeButtonSection(): void {
        const proposedPromocodeSection = document.querySelector(".summary__proposed-promo-codes") as HTMLElement | null;
        if (!proposedPromocodeSection) {
            return;
        }
        const promocodeSection = proposedPromocodeSection.querySelector(".promo-code") as HTMLElement | null;
        if (!promocodeSection) {
            return;
        }
        const id = promocodeSection.getAttribute("id") as string | null;
        if (!id) return;

        const addPromocodeButton = promocodeSection.querySelector(".promo-code__action") as HTMLElement | null;
        if (!addPromocodeButton) {
            return;
        }

        if (app.cart.usedPromocodes.find((item) => item.text === id)) {
            addPromocodeButton.style.display = "none";
        } else {
            addPromocodeButton.style.display = "block";
        }
    }

    private SetElementInnerHtml(parentElement: HTMLElement, selector: string, value: string): void {
        const element = parentElement.querySelector(selector) as HTMLElement;
        if (!element) {
            return;
        }
        element.innerHTML = value;
    }
}
