import { Product } from "./IProduct";

export interface CartProduct {
    product: Product;
    count: number;
    totalPrice: number;
}
