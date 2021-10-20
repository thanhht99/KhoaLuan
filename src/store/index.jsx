import { configureStore } from "@reduxjs/toolkit";

import accSlice from "./reducers/acc";
import userSlice from "./reducers/user";
import cartSlice from "./reducers/cart";
import infoOrderSlice from "./reducers/infoOrder";

export const store = configureStore({
  reducer: {
    acc: accSlice,
    user: userSlice,
    cart: cartSlice,
    infoOrder: infoOrderSlice,
  },
});
