import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Product: [],
};

export const productAllSlice = createSlice({
  name: "productAll",
  initialState,
  reducers: {
    insertProductAll: (state, action) => {
      state.Product = action.payload.newProduct;
    },
    resetProduct: () => initialState,
  },
});

export const { insertProductAll, resetProduct } = productAllSlice.actions;

export default productAllSlice.reducer;
