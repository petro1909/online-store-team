import { Product } from "./product";

export interface CartProduct {
    product: Product;
    count: number;
    totalPrice: number;
    cartIndex: number;
}
