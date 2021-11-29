import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  NeedSupport: [],
};

export const needSupportSlice = createSlice({
  name: "needSupport",
  initialState,
  reducers: {
    insertNeedSupport: (state, action) => {
      state.NeedSupport = action.payload.newNeedSupport;
    },
    addNeedSupport: (state, action) => {
      if (!state.NeedSupport.includes(action.payload.item)) {
        state.NeedSupport = [...state.NeedSupport, action.payload.item];
      }
      return state;
    },
    removeNeedSupport: (state, action) => {
      state.NeedSupport = state.NeedSupport.filter(
        (item) => item !== action.payload.item
      );
      return state;
    },
    resetNeedSupport: () => initialState,
  },
});

export const {
  insertNeedSupport,
  addNeedSupport,
  removeNeedSupport,
  resetNeedSupport,
} = needSupportSlice.actions;

export default needSupportSlice.reducer;
