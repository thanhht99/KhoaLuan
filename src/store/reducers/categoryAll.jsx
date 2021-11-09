import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Category: [],
};


export const categoryAllSlice = createSlice({
    name: "categoryAll",
    initialState,
    reducers: {
      insertCategory: (state, action) => {
        state.Category = action.payload.newCategory;
      },
      resetCategory: () => initialState,
    },
  });
  
  export const { insertCategory, resetCategory } = categoryAllSlice.actions;
  
  export default categoryAllSlice.reducer;
  