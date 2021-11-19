import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Promotion: [],
};

export const promotionAllSlice = createSlice({
  name: "promotionAll",
  initialState,
  reducers: {
    insertPromotionAll: (state, action) => {
      state.Promotion = action.payload.newPromotion;
    },
    resetPromotionAll: () => initialState,
  },
});

export const { insertPromotionAll, resetPromotionAll } =
  promotionAllSlice.actions;

export default promotionAllSlice.reducer;
