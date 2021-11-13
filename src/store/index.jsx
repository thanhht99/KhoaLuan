import { configureStore } from "@reduxjs/toolkit";

import accSlice from "./reducers/acc";
import userSlice from "./reducers/user";
import cartSlice from "./reducers/cart";
import infoOrderSlice from "./reducers/infoOrder";
import productDetailSlice from "./reducers/productDetail";
import categoryAllSlice from "./reducers/categoryAll";
import productAllSlice from "./reducers/productAll";
import categoryTAFSlice from "./reducers/categoryTrueAndFalse";
import categoryDetailSlice from "./reducers/categoryDetail";
import orderAllSlice from "./reducers/orderAll";
import orderDetailSlice from "./reducers/orderDetail";

export const store = configureStore({
  reducer: {
    acc: accSlice,
    user: userSlice,
    cart: cartSlice,
    infoOrder: infoOrderSlice,
    productDetail: productDetailSlice,
    productAll: productAllSlice,
    categoryAll: categoryAllSlice,
    categoryTAF: categoryTAFSlice,
    categoryDetail: categoryDetailSlice,
    orderAll: orderAllSlice,
    orderDetail: orderDetailSlice,
  },
});
