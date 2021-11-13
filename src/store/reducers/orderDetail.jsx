import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Order: {},
};

export const orderDetailSlice = createSlice({
  name: "orderDetail",
  initialState,
  reducers: {
    insertOrder: (state, action) => {
      state.Order = action.payload.newOrder;
    },
    resetOrder: () => initialState,
  },
});

export const { insertOrder, resetOrder } = orderDetailSlice.actions;

export default orderDetailSlice.reducer;
