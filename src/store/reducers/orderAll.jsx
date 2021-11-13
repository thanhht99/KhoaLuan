import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Order: [],
};

export const orderAllSlice = createSlice({
  name: "orderAll",
  initialState,
  reducers: {
    insertOrderAll: (state, action) => {
      state.Order = action.payload.newOrder;
    },
    resetOrderAll: () => initialState,
  },
});

export const { insertOrderAll, resetOrderAll } = orderAllSlice.actions;

export default orderAllSlice.reducer;
