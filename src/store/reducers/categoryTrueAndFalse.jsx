import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Category: [],
};

export const categoryTAFSlice = createSlice({
  name: "categoryTAF",
  initialState,
  reducers: {
    insertCategoryTAF: (state, action) => {
      state.Category = action.payload.newCategory;
    },
    resetCategoryTAF: () => initialState,
  },
});

export const { insertCategoryTAF, resetCategoryTAF } = categoryTAFSlice.actions;

export default categoryTAFSlice.reducer;
