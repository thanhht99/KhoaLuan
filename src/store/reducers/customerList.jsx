import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  CustomerList: [],
};

export const customerListSlice = createSlice({
  name: "customerList",
  initialState,
  reducers: {
    insertCustomerList: (state, action) => {
      state.CustomerList = action.payload.newCustomerList;
    },
    resetCustomerList: () => initialState,
  },
});

export const { insertCustomerList, resetCustomerList } =
  customerListSlice.actions;

export default customerListSlice.reducer;
