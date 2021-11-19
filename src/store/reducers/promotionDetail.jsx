import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Promotion: {},
};

export const promotionDetailSlice = createSlice({
  name: "promotionDetail",
  initialState,
  reducers: {
    insertPromotion: (state, action) => {
      state.Promotion = action.payload.newPromotion;
    },
    resetPromotion: () => initialState,
  },
});

export const { insertPromotion, resetPromotion } = promotionDetailSlice.actions;

export default promotionDetailSlice.reducer;
