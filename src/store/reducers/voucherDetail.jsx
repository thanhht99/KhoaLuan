import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Voucher: {},
};

export const voucherDetailSlice = createSlice({
  name: "voucherDetail",
  initialState,
  reducers: {
    insertVoucher: (state, action) => {
      state.Voucher = action.payload.newVoucher;
    },
    resetVoucher: () => initialState,
  },
});

export const { insertVoucher, resetVoucher } = voucherDetailSlice.actions;

export default voucherDetailSlice.reducer;
