import cartHtml from "./cart.html";
import "./cart.css";
import Cart from "../../model/Cart";

export default class CartView {
    public drawCart(cart: Cart, page: number): void {
        document.getElementById("root")!.innerHTML = cartHtml;

        const paginationTemplate =  document.getElementById("paginationTemplate")! as HTMLTemplateElement;
        const clonePaginationTemp = paginationTemplate.content.cloneNode(true) as HTMLElement;
        const content = document.querySelector(".content")! as HTMLDivElement;
        content.prepend(clonePaginationTemp);

        const paginationPageCurrent =       document.getElementById("pagination-page-current")! as HTMLInputElement;
        paginationPageCurrent.textContent = String(page);

        const fragment: DocumentFragment = document.createDocumentFragment();

        cart.cartProducts.forEach((product: CartProduct, idx: number): void => {
            const _product =         product.product;
            const cartItemTemplate = document.getElementById("cartItemTemplate")! as HTMLTemplateElement;
            const templateClone =    cartItemTemplate.content.cloneNode(true) as HTMLElement;

            const cartItemNumber =        templateClone.querySelector(".cart-item__number")! as HTMLSpanElement
            const productImg =            templateClone.querySelector(".product__img")! as HTMLImageElement;
            const productDescTitle =      templateClone.querySelector(".product__desc-title")! as HTMLElement;
            const productDescText =       templateClone.querySelector(".product__desc-text")! as HTMLElement;
            const productDescRating =     templateClone.querySelector(".product__desc-rating")! as HTMLElement;
            const productDescDiscount =   templateClone.querySelector(".product__desc-discount")! as HTMLElement;
            const cartItemStock =         templateClone.querySelector(".cart-item__stock")! as HTMLElement;
            const cartItemQuantity =      templateClone.querySelector(".cart-item__quantity")! as HTMLElement;
            const cartItemAmountControl = templateClone.querySelector(".cart-item__amount-control")! as HTMLElement;

            cartItemNumber.textContent =        String(idx + 1);
            productImg.src =                    String(_product.images[0]);
            productImg.alt =                    _product.title;
            productDescTitle.textContent =      _product.title;
            productDescText.textContent =       _product.description;
            productDescRating.textContent =     `Rating: ${_product.rating}`;
            productDescDiscount.textContent =   `Discount: ${_product.discountPercentage}%`;
            cartItemStock.textContent =         `Stock: ${_product.stock}`;
            cartItemQuantity.textContent =      String(product.count);
            cartItemAmountControl.textContent = `€${product.totalPrice}`;

            fragment.append(templateClone);

        })

        const contentContainer = document.querySelector(".content__container")! as HTMLDivElement;
        contentContainer.appendChild(fragment);

        const cartBuyNowTemplate =  document.getElementById("cartBuyNowTemplate")! as HTMLTemplateElement;
        const cloneCartBuyNowTemp = cartBuyNowTemplate.content.cloneNode(true) as HTMLElement;
        const _cart = document.querySelector(".cart")!;
        _cart.append(cloneCartBuyNowTemp);

        const buyNowProducts = document.querySelector(".buy-now__products")! as HTMLDivElement;
        const buyNowTotal =    document.querySelector(".buy-now__total")! as HTMLSpanElement;

        buyNowProducts.textContent = String(cart.cartProducts.length);
        buyNowTotal.textContent = String(cart.totalPrice);

        const buyNowInputCode = document.querySelector(".buy-now__input-promo")! as HTMLInputElement;
        buyNowInputCode.addEventListener("change", () => { console.log('promo-code', buyNowInputCode.value)});

        const buyNowSubmit = document.querySelector(".buy-now__submit")! as HTMLButtonElement;
        buyNowSubmit.addEventListener("click", () => { console.log('buy-now pressed')});
    }
}
