/* eslint-disable @typescript-eslint/no-non-null-assertion */
import productHtml from "./product.html";
import "./product.css";
import Cart from "../../model/Cart";
import { Product } from "../../model/type/IProduct";

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
        const productImagesButtons = document.getElementById("product-images-buttons")!;

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

        const controls = document.getElementById("product-images-buttons");

        for (let i = 0; i < product.images.length; i++) {
            const element = document.createElement("button");
            element.classList.add("controls__btn");
            element.setAttribute("data-id", String(i));
            controls!.append(element)
        }

        productImagesButtons.addEventListener("click", (event) => {
            const clickedElement = event.target! as HTMLButtonElement;
            const idx = Number(clickedElement.getAttribute("data-id"))!;
            productImage.src = `${product.images[idx]}`;
        });

        productDescription.textContent = product.description;
        productDiscount.textContent = product.discountPercentage + "%";
        productRating.textContent = String(product.rating);
        productStock.textContent = String(product.stock);
        productBrand.textContent = product.brand;
        productCategory.textContent = product.category;

        cartCost.textContent = "€" + cart.totalPrice; // TODO fix to wright value
    }
}