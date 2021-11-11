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
    resetProductAll: () => initialState,
  },
});

export const { insertProductAll, resetProductAll } = productAllSlice.actions;

export default productAllSlice.reducer;
