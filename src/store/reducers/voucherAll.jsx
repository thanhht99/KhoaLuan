import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Voucher: [],
};

export const voucherAllSlice = createSlice({
  name: "voucherAll",
  initialState,
  reducers: {
    insertVoucherAll: (state, action) => {
      state.Voucher = action.payload.newVoucher;
    },
    resetVoucherAll: () => initialState,
  },
});

export const { insertVoucherAll, resetVoucherAll } = voucherAllSlice.actions;

export default voucherAllSlice.reducer;
