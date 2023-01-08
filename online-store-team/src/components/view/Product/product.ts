/* eslint-disable @typescript-eslint/no-non-null-assertion */
import productHtml from "./product.html";
import "./product.css";
import { Product } from "../../model/type/product";
import { app } from "../../..";
import CartView from "../Cart/cart";
import { CartOptions } from "../../model/storeOptions";

export default class ProductView {
    public async drawProduct(productId: number): Promise<void> {
        const rootElement = document.getElementById("root") as HTMLElement | null;
        if (!rootElement) {
            return;
        }
        rootElement.innerHTML = "";
        const productWrapperTempalte = document.createRange().createContextualFragment(productHtml);
        const productWrapperSection = productWrapperTempalte.querySelector(".thing") as HTMLElement | null;
        if (!productWrapperSection) {
            return;
        }
        rootElement.append(productWrapperSection);
        const findedProduct = app.store.products.find((product) => product.id === productId);
        if (!findedProduct) {
            productWrapperSection.innerHTML = `No product with such id ${productId}`;
            return;
        }
        await app.store.removeDuplicatesFromProductImages(findedProduct);
        const productIdentifierSection = document.getElementById("product-id");
        if (productIdentifierSection) {
            productIdentifierSection.setAttribute("data-id", `${findedProduct.id}`);
        }
        this.SetElementInnerHtml(productWrapperSection, "#product-title", findedProduct.title);
        this.SetElementInnerHtml(productWrapperSection, "#product-description", findedProduct.description);
        this.SetElementInnerHtml(productWrapperSection, "#product-discount", `${findedProduct.discountPercentage}%`);
        this.SetElementInnerHtml(productWrapperSection, "#product-rating", `${findedProduct.rating}`);
        this.SetElementInnerHtml(productWrapperSection, "#product-stock", `${findedProduct.stock}`);
        this.SetElementInnerHtml(productWrapperSection, "#product-brand", findedProduct.brand);
        this.SetElementInnerHtml(productWrapperSection, "#product-category", findedProduct.category);
        this.SetElementInnerHtml(productWrapperSection, "#product-price", `€${findedProduct.price}`);

        const breadcrumbs = document.getElementById("breadcrumbs") as HTMLElement;
        breadcrumbs.addEventListener("click", (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
            const element = event.target as HTMLAnchorElement;
            if (element.classList.contains("breadcrumbs__link")) {
                app.router.route(element.href);
            }
        });

        this.SetAnchorHrefAndInnerHtml(productWrapperSection, "#breadcrumb-link-store", "/", "Store");
        this.SetAnchorHrefAndInnerHtml(
            productWrapperSection,
            "#breadcrumb-link-category",
            `/?categories=${findedProduct.category}`,
            `${findedProduct.category}`
        );

        this.SetAnchorHrefAndInnerHtml(
            productWrapperSection,
            "#breadcrumb-link-brand",
            `/?categories=${findedProduct.category}&brands=${findedProduct.brand}`,
            `${findedProduct.brand}`
        );
        this.SetAnchorHrefAndInnerHtml(
            productWrapperSection,
            "#breadcrumb-link-product",
            `/product/${findedProduct.id}`,
            `${findedProduct.title}`
        );

        const buyNowButton = document.querySelector(".object__buy-now") as HTMLElement | null;
        if (buyNowButton) {
            buyNowButton.addEventListener("click", () => this.buyProductNow(findedProduct));
        }

        const cartActionButton = document.querySelector(".object__cart-action") as HTMLElement | null;
        if (cartActionButton) {
            this.switchProductButton(findedProduct, cartActionButton);
            cartActionButton.addEventListener("click", () => this.cartAction(findedProduct, cartActionButton));
        }
        const productImage = document.getElementById("product-image") as HTMLImageElement | null;
        if (productImage) {
            productImage.src = `${findedProduct.images[0]}`;
            this.drawProductImages(findedProduct, productImage);
        }
        // const isId = app.cart.isProductInCart(findedProduct.id);
        // if (isId) {
        //     const currentAddButton = document.querySelector(".object__add-to-cart")! as HTMLElement;
        //     ProductView.switchProductButton("DROP FROM CART", currentAddButton);
        // }

        // document.querySelector(".object__buttons")!.addEventListener("click", this.productClickHandler);
    }

    private drawProductImages(product: Product, imageSection: HTMLImageElement): void {
        const controlsOfImages = document.getElementById("product-images-buttons") as HTMLElement | null;
        if (!controlsOfImages) {
            return;
        }
        for (let i = 0; i < product.images.length; i++) {
            const element = document.createElement("button");
            element.classList.add("controls__btn");
            element.setAttribute("data-id", `${i}`);
            if (i === 0) element.classList.add("controls__btn_active");
            controlsOfImages.append(element);
        }
        controlsOfImages.addEventListener("click", (e) => this.slideImages(e, product, imageSection));
    }

    private slideImages(e: MouseEvent, product: Product, imageSection: HTMLImageElement) {
        const clickedElement = e.target as HTMLElement | null;
        if (!clickedElement) {
            return;
        }
        if (!clickedElement.classList.contains("controls__btn")) {
            return;
        }
        const strId = clickedElement.getAttribute("data-id");
        if (!strId) {
            return;
        }
        const id = Number.parseInt(strId);
        if (id === undefined) {
            return;
        }
        const controls = document.querySelectorAll(".controls__btn");
        controls.forEach((element) => element.classList.remove("controls__btn_active"));
        clickedElement.classList.add("controls__btn_active");
        imageSection.src = `${product.images[id]}`;
    }

    private switchProductButton(product: Product, clickedButton: HTMLElement): void {
        if (app.cart.isProductInCart(product.id)) {
            clickedButton.innerHTML = "DROP FROM CART";
        } else {
            clickedButton.innerHTML = "ADD TO CART";
        }
    }
    private cartAction(product: Product, actionButton: HTMLElement): void {
        if (app.cart.isProductInCart(product.id)) {
            app.cart.dropProductFromCart(product.id);
        } else {
            app.cart.putProductIntoCart(product);
        }
        app.header.drawHeader(app.cart);
        this.switchProductButton(product, actionButton);
    }

    private buyProductNow(product: Product) {
        const cartView = new CartView();
        const isProductInCart = app.cart.isProductInCart(product.id);

        if (!isProductInCart) {
            app.cart.putProductIntoCart(product!);
        }
        app.router.route(`/cart`);
        cartView.drawCart(new CartOptions());
        cartView.drawOrder();
    }

    private SetElementInnerHtml(parentElement: HTMLElement, selector: string, value: string): void {
        const element = parentElement.querySelector(selector) as HTMLElement;
        if (!element) {
            return;
        }
        element.innerHTML = value;
    }

    private SetAnchorHrefAndInnerHtml(
        parentElement: HTMLElement,
        selector: string,
        href: string,
        innerHTML: string
    ): void {
        const element = parentElement.querySelector(selector) as HTMLAnchorElement;
        if (!element) {
            return;
        }
        element.href = href;
        element.innerHTML = innerHTML;
    }
}
