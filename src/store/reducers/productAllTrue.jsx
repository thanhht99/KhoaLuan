import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Product: [],
};

export const productAllTrueSlice = createSlice({
  name: "productAllTrue",
  initialState,
  reducers: {
    insertProductAllTrue: (state, action) => {
      state.Product = action.payload.newProduct;
    },
    resetProductAllTrue: () => initialState,
  },
});

export const { insertProductAllTrue, resetProductAllTrue } =
  productAllTrueSlice.actions;

export default productAllTrueSlice.reducer;
