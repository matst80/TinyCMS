import Cart from "./Cart";
import Product from "./Product";
import AddToCart from "./AddToCart";

const shopComponents = {
    "cart": Cart,
    "nodeproduct": Product,
    "addtocart": AddToCart
}
export const mergeShopComponents = (data) => {
    return { ...shopComponents, ...data };
}

export default {
    Cart,
    AddToCart,
    Product
};