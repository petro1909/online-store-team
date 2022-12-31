/* eslint-disable @typescript-eslint/no-non-null-assertion */
import cartHtml from "./cart.html";
import "./cart.css";
import Cart from "../../model/Cart";
import OrderView from "../../view/Order/order";
import { CartProduct } from "../../model/type/ICartProduct";
import { app } from "../../../index";
import { CartOptions } from "../../model/type/IFilterOptions";
import { IPromocode } from "../../model/type/IPromocode";

export default class CartView {
    private cartOptions: CartOptions = new CartOptions();
    public drawCart(cartOptions: CartOptions): void {
        this.cartOptions = cartOptions;
        document.getElementById("root")!.innerHTML = cartHtml;

        const fragment: DocumentFragment = document.createDocumentFragment();
        const paginationTemplate = document.getElementById("paginationTemplate")! as HTMLTemplateElement;
        const clonePaginationTemp = paginationTemplate.content.cloneNode(true) as HTMLElement;
        const content = document.querySelector(".content")! as HTMLDivElement;
        content.prepend(clonePaginationTemp);

        const paginationPageCurrent = document.getElementById("pagination-page-current")! as HTMLInputElement;
        const paginationLimitInput = document.getElementById("pagination-limit-input")! as HTMLInputElement;

        paginationLimitInput.value = String(cartOptions.limit!);
        paginationPageCurrent.textContent = String(cartOptions.page!);

        const currentPageProductsList = app.cart.cartProducts.slice(
            (cartOptions.page - 1) * cartOptions.limit,
            (cartOptions.page - 1) * cartOptions.limit + cartOptions.limit
        );

        currentPageProductsList.forEach((product: CartProduct, idx: number): void => {
            const _product = product.product;
            const cartItemTemplate = document.getElementById("cartItemTemplate")! as HTMLTemplateElement;
            const templateClone = cartItemTemplate.content.cloneNode(true) as HTMLElement;

            const cartItem = templateClone.querySelector(".cart-item")! as HTMLElement;
            const cartItemNumber = templateClone.querySelector(".cart-item__number")! as HTMLSpanElement;
            const productImg = templateClone.querySelector(".product__img")! as HTMLImageElement;
            const productDescTitle = templateClone.querySelector(".product__desc-title")! as HTMLElement;
            const productDescText = templateClone.querySelector(".product__desc-text")! as HTMLElement;
            const productDescRating = templateClone.querySelector(".product__desc-rating")! as HTMLElement;
            const productDescDiscount = templateClone.querySelector(".product__desc-discount")! as HTMLElement;
            const cartItemStock = templateClone.querySelector(".cart-item__stock")! as HTMLElement;
            const cartItemQuantity = templateClone.querySelector(".cart-item__quantity")! as HTMLElement;
            const cartItemAmountControl = templateClone.querySelector(".cart-item__amount-control")! as HTMLElement;

            cartItem.setAttribute("data-id", String(_product.id));
            cartItemNumber.textContent = String((cartOptions.page - 1) * cartOptions.limit + idx + 1);
            productImg.src = String(_product.images[0]);
            productImg.alt = _product.title;
            productDescTitle.textContent = _product.title;
            productDescText.textContent = _product.description;
            productDescRating.textContent = `Rating: ${_product.rating}`;
            productDescDiscount.textContent = `Discount: ${_product.discountPercentage}%`;
            cartItemStock.textContent = `Stock: ${_product.stock}`;
            cartItemQuantity.textContent = String(product.count);
            cartItemAmountControl.textContent = `€${product.totalPrice}`;

            fragment.append(templateClone);
        });

        const contentContainer = document.querySelector(".content__container")! as HTMLDivElement;
        contentContainer.appendChild(fragment);

        const cartBuyNowTemplate = document.getElementById("cartBuyNowTemplate")! as HTMLTemplateElement;
        const cloneCartBuyNowTemp = cartBuyNowTemplate.content.cloneNode(true) as HTMLElement;
        const _cart = document.querySelector(".cart")!;
        _cart.append(cloneCartBuyNowTemp);

        const buyNowProducts = document.querySelector(".buy-now__products-value")! as HTMLDivElement;

        const productItemsQuantity = app.cart.cartProducts.reduce<number>((acc, item: CartProduct): number => {
            return acc + item.count;
        }, 0);
        app.header.drawHeader(app.cart);

        buyNowProducts.textContent = String(productItemsQuantity);

        const buyNowTotal = document.querySelector(".buy-now__total-value")! as HTMLElement;
        buyNowTotal.textContent = app.cart.totalPrice.toString();

        const buyNowActualTotalSection = document.querySelector(".buy-now__actual-total-text")! as HTMLElement;
        const buyNowActualTotal = document.querySelector(".buy-now__actual-total-value")! as HTMLElement;
        buyNowActualTotal.textContent = app.cart.actualPrice.toString();
        if (app.cart.totalPrice === app.cart.actualPrice) {
            buyNowActualTotalSection.style.display = "none";
        }

        //promo codes
        //used promo codes
        const usedPromocodesSection = document.querySelector(".buy-now__used-promo-codes") as HTMLElement;
        const usedPromocodesListSection = usedPromocodesSection.querySelector(
            ".buy-now__used-promo-codes-list"
        ) as HTMLElement;
        console.log(app.cart);
        usedPromocodesSection!.addEventListener("click", this.removePromocode);
        app.cart.usedPromocodes.forEach((promocode) => {
            usedPromocodesListSection.append(this.createPromocodeSection(promocode, "DROP"));
        });
        if (app.cart.usedPromocodes.length === 0) {
            usedPromocodesSection.style.display = "none";
        }
        //proposed promo codes
        const proposedPromocodeSection = document.querySelector(".buy-now__proposed-promo-codes") as HTMLElement;
        proposedPromocodeSection!.addEventListener("click", this.setPromocode);

        const allPromocodes = document.querySelector(".buy-now__all-promo-codes")! as HTMLDivElement;
        allPromocodes.innerHTML =
            "Promocodes for test <br>" + Cart.promocodes.map((promocode: IPromocode) => promocode.text).join(", ");

        if (currentPageProductsList.length === 0 && app.cart.cartProducts.length > 0) {
            app.router.route("error");
        } else if (app.cart.cartProducts.length === 0) {
            cartOptions = { page: 1, limit: 3 };
            _cart.innerHTML = "<h2>Cart is Empty</h2>";
        } else {
            this.addHandlers();
        }
    }

    private addHandlers(): void {
        const cartItem = document.querySelector(".content__container")!;

        cartItem.addEventListener("click", (event) => {
            const clickedElement = event.target as HTMLElement;
            const idProduct = clickedElement.closest(".cart-item")!.getAttribute("data-id");
            if (clickedElement.classList.contains("cart-item__decrease-btn")) {
                app.cart.decreaceCartProductCount(Number(idProduct));
                app.cart.updateCartProducts(this.cartOptions);
                this.drawCart(this.cartOptions);
            }
            if (clickedElement.classList.contains("cart-item__increase-btn")) {
                app.cart.increaceCartProductCount(Number(idProduct));
                app.cart.updateCartProducts(this.cartOptions);
                this.drawCart(this.cartOptions);
            }
            if (clickedElement.classList.contains("product__img")) {
                app.router.route("product/" + idProduct);
            }
        });

        const buyNowInputCode = document.querySelector(".buy-now__input-promo")! as HTMLInputElement;
        buyNowInputCode.addEventListener("input", (event) => {
            const inputPromo = event.target as HTMLInputElement;
            const value = inputPromo!.value;
            this.findPromocode(value);
        });

        const buyNowSubmit = document.querySelector(".buy-now__submit")! as HTMLButtonElement;
        buyNowSubmit.addEventListener("click", () => {
            console.log("buy-now pressed");
            const orderView = new OrderView();
            orderView.drawOrder();
        });

        const paginationCurrentPageNumber = document.querySelector(".pagination__page-number")! as HTMLElement;
        paginationCurrentPageNumber.addEventListener("click", (event) => {
            const clickedButton = event.target! as HTMLButtonElement;
            if (clickedButton.classList.contains("pagination__page-prev")) {
                this.cartOptions.page = this.cartOptions.page - 1;
                app.cart.updateCartProducts(this.cartOptions);
                this.drawCart(this.cartOptions);
            } else if (clickedButton.classList.contains("pagination__page-next")) {
                this.cartOptions.page = this.cartOptions.page + 1;
                app.cart.updateCartProducts(this.cartOptions);
                this.drawCart(this.cartOptions);
            }
        });

        const paginationLimitInput = document.getElementById("pagination-limit-input")! as HTMLInputElement;
        paginationLimitInput.addEventListener("change", (event: Event) => {
            const inputLimit = event.target! as HTMLInputElement;
            this.cartOptions.limit = Number(inputLimit.value);
            app.cart.updateCartProducts(this.cartOptions);
            this.drawCart(this.cartOptions);
        });
    }

    //input promocode text
    private findPromocode(value: string) {
        const proposedPromocodesSection = document.querySelector(".buy-now__proposed-promo-codes") as HTMLElement;
        proposedPromocodesSection!.innerHTML = "";
        const findedPromocode = Cart.promocodes.find((promocode) => value === promocode.text);
        if (!findedPromocode) {
            return;
        }
        proposedPromocodesSection.append(this.createPromocodeSection(findedPromocode, "ADD"));
        if (app.cart.usedPromocodes.includes(findedPromocode)) {
            const addPromocodeButton = proposedPromocodesSection.querySelector(".promo-code__action") as HTMLElement;
            addPromocodeButton.style.display = "none";
        }
    }

    private setPromocode = (e: MouseEvent) => {
        const eventTarget = e.target as HTMLElement;
        if (!eventTarget.classList.contains("promo-code__action")) {
            return;
        }
        const promocodeSection = eventTarget.closest(".promo-code") as Element | null;
        if (!promocodeSection) {
            return;
        }
        const promocodeId = promocodeSection.getAttribute("id") as string | null;
        if (!promocodeId) {
            return;
        }
        const findedPromocode = Cart.promocodes.find((promocode) => promocodeId === promocode.text);
        if (!findedPromocode) {
            return;
        }
        if (app.cart.usedPromocodes.includes(findedPromocode)) {
            return;
        }
        app.cart.setPromocode(findedPromocode);
        if (app.cart.usedPromocodes.length === 1) {
            const usedPromoCodesSection = document.querySelector(".buy-now__used-promo-codes") as HTMLElement;
            usedPromoCodesSection!.style.display = "block";
            const cartTotalPriceSection = document.querySelector(".buy-now__total-text") as HTMLElement;
            cartTotalPriceSection!.style.textDecoration = "line-through";
        }
        const usedPromoCodesSection = document.querySelector(".buy-now__used-promo-codes-list") as HTMLElement;
        usedPromoCodesSection.append(this.createPromocodeSection(findedPromocode, "DROP"));
        const addPromocodeButton = promocodeSection.querySelector(".promo-code__action") as HTMLElement;
        addPromocodeButton.style.display = "none";

        const cartActualTotalPriceSection = document.querySelector(".buy-now__actual-total-text") as HTMLElement;
        const cartActualTotalPrice = document.querySelector(".buy-now__actual-total-value") as HTMLElement;
        cartActualTotalPrice!.innerHTML = app.cart.actualPrice.toString();
        cartActualTotalPriceSection!.style.display = "block";
    };

    private removePromocode(e: MouseEvent) {
        const eventTarget = e.target as HTMLElement;
        if (!eventTarget.classList.contains("promo-code__action")) return;

        const promocodeSection = eventTarget.closest(".promo-code") as Element | null;
        if (!promocodeSection) return;

        const removedPromocodeId = promocodeSection.getAttribute("id") as string | null;
        if (!removedPromocodeId) return;

        app.cart.removePromocode(removedPromocodeId);
        promocodeSection.remove();

        const cartActualTotalPrice = document.querySelector(".buy-now__actual-total-value") as HTMLElement;
        cartActualTotalPrice!.innerHTML = app.cart.actualPrice.toString();

        if (app.cart.usedPromocodes.length === 0) {
            const usedPromoCodesSection = document.querySelector(".buy-now__used-promo-codes") as HTMLElement;
            usedPromoCodesSection!.style.display = "none";
            const cartActualTotalPriceSection = document.querySelector(".buy-now__actual-total-text") as HTMLElement;
            cartActualTotalPriceSection!.style.display = "none";
            const cartTotalPriceSection = document.querySelector(".buy-now__total-text") as HTMLElement;
            cartTotalPriceSection!.style.textDecoration = "none";
        }

        const proposedPromocodesSection = document.querySelector(".buy-now__proposed-promo-codes") as HTMLElement;
        const proposedPromocodeSection = proposedPromocodesSection.querySelector(".promo-code") as HTMLElement;
        const proposedPromocodeId = proposedPromocodeSection.getAttribute("id");
        if (!proposedPromocodeId) return;
        if (proposedPromocodeId === removedPromocodeId) {
            const proposedPromocodeButton = proposedPromocodeSection.querySelector(
                ".promo-code__action"
            ) as HTMLElement;
            if (!proposedPromocodeButton) return;
            proposedPromocodeButton.style.display = "block";
        }
    }

    private createPromocodeSection(promocode: IPromocode, buttonText: string): HTMLElement {
        const proposedPromocodeTemplate = document.getElementById("promo-codeTemplate") as HTMLTemplateElement;
        const proposedPromocodeSection = proposedPromocodeTemplate.content.children[0]!.cloneNode(true) as HTMLElement;
        proposedPromocodeSection.id = promocode.text;

        const proposedPromocodeName = proposedPromocodeSection.querySelector(".promo-code__name");
        proposedPromocodeName!.innerHTML = promocode.text;

        const proposedPromocodeDiscount = proposedPromocodeSection.querySelector(".promo-code__discount");
        proposedPromocodeDiscount!.innerHTML = promocode.discount.toString() + "%";

        const addPromocodeButton = proposedPromocodeSection.querySelector(".promo-code__action");
        addPromocodeButton!.innerHTML = buttonText;
        return proposedPromocodeSection;
    }
}
