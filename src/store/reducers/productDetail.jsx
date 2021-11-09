import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Product: {},
};

export const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {
    insertProduct: (state, action) => {
      state.Product = action.payload.newProduct;
    },
    resetProduct: () => initialState,
  },
});

export const { insertProduct, resetProduct } = productDetailSlice.actions;

export default productDetailSlice.reducer;
