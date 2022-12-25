/* eslint-disable @typescript-eslint/no-non-null-assertion */
import productHtml from "./product.html";
import "./product.css";
import Cart from "../../model/Cart";
import { Product } from "../../model/type/IProduct";
import { app } from "../../..";
import OrderView from "../../view/Order/order";
import CartView from "../../view/Cart/cart";

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
        cartCost.textContent = "€" + product.price;

        const cartItemsIds = this.selectCartItemsIds(app.cart); // TODO refactor using app.cart.isProductInCart(id);
        const isId = cartItemsIds.find((id): boolean => {
            return id === product.id;
        });
        if (isId) {
            const currentAddButton = document.querySelector(".object__add-to-cart")! as HTMLElement;
            ProductView.switchProductButton("DROP FROM CART", currentAddButton);
        }

        const controlsOfImages = document.getElementById("product-images-buttons")!;
        for (let i = 0; i < product.images.length; i++) {
            const element = document.createElement("button");
            element.classList.add("controls__btn");
            element.setAttribute("data-id", String(i));
            if(i === 0) element.classList.add("controls__btn_active");
            controlsOfImages!.append(element);
        }

        controlsOfImages.addEventListener("click", (event) => {
            const controls = document.querySelectorAll(".controls__btn");
            const clickedElement = event.target! as HTMLButtonElement;
            const idx = Number(clickedElement.getAttribute("data-id"))!;
            controls.forEach(element => element.classList.remove("controls__btn_active"));
            if(clickedElement.classList.contains("controls__btn")) {
                clickedElement.classList.add("controls__btn_active");
                productImage.src = `${product.images[idx]}`;
            }
        });

        document.querySelector(".object__buttons")!.addEventListener("click", this.productClickHandler);
    }

    private productClickHandler(event: Event): void {
        const clickedElement = event.target as HTMLElement;
        const productId = clickedElement.closest(".product__obj")!.getAttribute("data-id")!;
        const product = app.store.products.find((item) => item.id === +productId!);

        if (clickedElement.classList.contains("object__add-to-cart")) {
            app.cart.putProductIntoCart(product!);
            ProductView.switchProductButton("DROP FROM CART", clickedElement);
        } else if (clickedElement.classList.contains("object__drop-from-cart")) {
            app.cart.dropProductIntoCart(Number(productId));
            ProductView.switchProductButton("ADD TO CART", clickedElement);
        } else if (clickedElement.classList.contains("object__buy-now")) {
            const orderView = new OrderView();
            const cartView = new CartView();
            const isProductInCart = app.cart.isProductInCart(Number(productId));

            if (isProductInCart) {
                cartView.drawCart(app.cart, 0);
                orderView.drawOrder();
                app.router.route(`/cart`);
            } else {
                app.cart.putProductIntoCart(product!);
                cartView.drawCart(app.cart, 0);
                orderView.drawOrder();
                app.router.route(`/cart`);
            }
        }
    }

    private selectCartItemsIds(cart: Cart) {
        // TODO refactor using app.cart.isProductInCart(id);
        const items = cart.cartProducts;
        const itemIds: Array<number> = items.map((item): number => {
            return item.product.id;
        });
        return itemIds;
    }

    private static switchProductButton(textContent: string, clickedButton: HTMLElement): void {
        const cartCost = document.getElementById("cart-cost")!;
        cartCost.textContent = "€" + app.cart.totalPrice;
        clickedButton.classList.toggle("object__drop-from-cart");
        clickedButton.classList.toggle("object__add-to-cart");
        clickedButton.textContent = textContent;
        app.header.drawHeader(app.cart);
    }
}
