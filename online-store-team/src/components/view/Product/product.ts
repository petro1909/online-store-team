/* eslint-disable @typescript-eslint/no-non-null-assertion */
import productHtml from "./product.html";
import "./product.css";
import Cart from "../../model/Cart";
import { Product } from "../../model/type/IProduct";
import { app } from "../../..";

export default class ProductView {
    public drawProduct(product: Product, cart: Cart): void {

        document.getElementById("root")!.innerHTML = productHtml;

        const productId = document.getElementById("product-id")!;
        const breadcrumbLinkStore = document.getElementById("breadcrumb-link-store")!;
        const breadcrumbLinkCategory = document.getElementById("breadcrumb-link-category")!;
        const breadcrumbLinkBrand = document.getElementById("breadcrumb-link-brand")!;
        const breadcrumbLinkProduct = document.getElementById("breadcrumb-link-product")!;
        const productTitle = document.getElementById("product-title")!;
        const productImage = document.getElementById("product-image")! as HTMLImageElement;
        const productDescription = document.getElementById("product-description")!;
        const productDiscount = document.getElementById("product-discount")!;
        const productRating = document.getElementById("product-rating")!;
        const productStock = document.getElementById("product-stock")!;
        const productBrand = document.getElementById("product-brand")!;
        const productCategory = document.getElementById("product-category")!;
        const cartCost = document.getElementById("cart-cost")!;

        productId.setAttribute("data-id", String(product.id));
        breadcrumbLinkStore.textContent = "Store";
        breadcrumbLinkCategory.textContent = product.category;
        breadcrumbLinkBrand.textContent = product.brand;
        breadcrumbLinkProduct.textContent = product.title;
        productTitle.textContent = product.title;
        productImage.src = `${product.images[0]}`;
        productDescription.textContent = product.description;
        productDiscount.textContent = product.discountPercentage + "%";
        productRating.textContent = String(product.rating);
        productStock.textContent = String(product.stock);
        productBrand.textContent = product.brand;
        productCategory.textContent = product.category;
        cartCost.textContent = "€" + cart.totalPrice;

        const cartItemsIds  = this.selectCartItemsIds(app.cart);
        const isId = cartItemsIds.find((id): boolean => { return id === product.id});
        if(isId) {
            const currentAddButton = document.querySelector(".object__add-to-cart")! as HTMLElement;
            ProductView.switchProductButton("DROP FROM CART", currentAddButton);
        }

        const controlsOfImages = document.getElementById("product-images-buttons")!;
        for (let i = 0; i < product.images.length; i++) {
            const element = document.createElement("button");
            element.classList.add("controls__btn");
            element.setAttribute("data-id", String(i));
            controlsOfImages!.append(element)
        }

        controlsOfImages.addEventListener("click", (event) => {
            const clickedElement = event.target! as HTMLButtonElement;
            const idx = Number(clickedElement.getAttribute("data-id"))!;
            productImage.src = `${product.images[idx]}`;
        });

        document.querySelector(".object__buttons")!.addEventListener("click", this.productClickHandler);

    }

    private productClickHandler(event: Event): void {

        const clickedElement = event.target as HTMLElement;
        const cartCost = document.getElementById("cart-cost")!;
        const productId = clickedElement.closest(".product__obj")!.getAttribute("data-id")!;
        const product = app.store.products.find((item) => item.id === +productId!);

        if (clickedElement.classList.contains("object__add-to-cart")) {
            app.cart.putProductIntoCart(product!);
            app.header.drawHeader(app.cart);
            cartCost.textContent = "€" + app.cart.totalPrice;
            ProductView.switchProductButton("DROP FROM CART", clickedElement);
        } else if (clickedElement.classList.contains("object__drop-from-cart")) {
            app.cart.dropProductIntoCart(Number(productId));
            app.header.drawHeader(app.cart);
            cartCost.textContent = "€" + app.cart.totalPrice;
            ProductView.switchProductButton("ADD TO CART", clickedElement);
        }

    }

    private selectCartItemsIds(cart: Cart) {
        const items = cart.cartProducts;
        const itemIds: Array<number> = items.map((item): number => { return item.product.id})
        return itemIds;
    }

    private static switchProductButton(textContent: string, clickedButton: HTMLElement): void {
        clickedButton.classList.toggle("object__drop-from-cart");
        clickedButton.classList.toggle("object__add-to-cart");
        clickedButton.textContent = textContent;
    }

}