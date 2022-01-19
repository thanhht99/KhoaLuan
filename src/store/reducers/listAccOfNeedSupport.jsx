import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  AccNeedSupport: [],
};

export const accNeedSupportSlice = createSlice({
  name: "accNeedSupport",
  initialState,
  reducers: {
    insertAccNeedSupport: (state, action) => {
      state.AccNeedSupport = action.payload.newAccNeedSupport;
    },
    addAccNeedSupport: (state, action) => {
      if (!state.AccNeedSupport.includes(action.payload.item)) {
        state.AccNeedSupport = [...state.AccNeedSupport, action.payload.item];
      }
      return state;
    },
    removeAccNeedSupport: (state, action) => {
      state.AccNeedSupport = state.AccNeedSupport.filter(
        (item) => item !== action.payload.item
      );
      return state;
    },
    resetAccNeedSupport: () => initialState,
  },
});

export const {
  insertAccNeedSupport,
  addAccNeedSupport,
  removeAccNeedSupport,
  resetAccNeedSupport,
} = accNeedSupportSlice.actions;

export default accNeedSupportSlice.reducer;
