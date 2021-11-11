import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Category: {},
};

export const categoryDetailSlice = createSlice({
  name: "categoryDetail",
  initialState,
  reducers: {
    insertCategoryDetail: (state, action) => {
      state.Category = action.payload.newCategory;
    },
    resetCategoryDetail: () => initialState,
  },
});

export const { insertCategoryDetail, resetCategoryDetail } =
  categoryDetailSlice.actions;

export default categoryDetailSlice.reducer;
