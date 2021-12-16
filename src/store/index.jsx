import { configureStore } from "@reduxjs/toolkit";

import accSlice from "./reducers/acc";
import userSlice from "./reducers/user";
import cartSlice from "./reducers/cart";
import infoOrderSlice from "./reducers/infoOrder";
import productDetailSlice from "./reducers/productDetail";
import categoryAllSlice from "./reducers/categoryAll";
import productAllSlice from "./reducers/productAll";
import productAllTrueSlice from "./reducers/productAllTrue";
import categoryTAFSlice from "./reducers/categoryTrueAndFalse";
import categoryDetailSlice from "./reducers/categoryDetail";
import orderAllSlice from "./reducers/orderAll";
import orderDetailSlice from "./reducers/orderDetail";
import voucherAllSlice from "./reducers/voucherAll";
import voucherDetailSlice from "./reducers/voucherDetail";
import promotionAllSlice from "./reducers/promotionAll";
import promotionDetailSlice from "./reducers/promotionDetail";

import needSupportSlice from "./reducers/listOfNeedSupport";
import staffListSlice from "./reducers/staffList";
import customerListSlice from "./reducers/customerList";
import feedbackSlice from "./reducers/feedbackAll";

export const store = configureStore({
  reducer: {
    acc: accSlice,
    user: userSlice,
    cart: cartSlice,
    infoOrder: infoOrderSlice,

    productDetail: productDetailSlice,
    productAll: productAllSlice,
    productAllTrue: productAllTrueSlice,

    categoryAll: categoryAllSlice,
    categoryTAF: categoryTAFSlice,
    categoryDetail: categoryDetailSlice,

    orderAll: orderAllSlice,
    orderDetail: orderDetailSlice,

    voucherAll: voucherAllSlice,
    voucherDetail: voucherDetailSlice,

    promotionAll: promotionAllSlice,
    promotionDetail: promotionDetailSlice,

    needSupport: needSupportSlice,
    staffList: staffListSlice,
    customerList: customerListSlice,

    feedbackAll: feedbackSlice,
  },
});
