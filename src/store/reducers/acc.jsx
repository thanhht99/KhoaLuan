import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Acc: {},
};

export const accSlice = createSlice({
  name: "acc",
  initialState,
  reducers: {
    getAcc: (state, action) => {
      state.Acc = action.payload.Acc;
    },
    insertAcc: (state, action) => {
      state.Acc = action.payload.newAcc;
    },
    updateAcc: (state, action) => {
      const { updatedData } = action.payload;
      state.Acc = state.Acc.map((store) => {
        if (store.id !== updatedData.id) return store;
        return updatedData;
      });
    },
    removeAcc: (state, action) => {
      state.Acc = state.Acc.filter(
        (store) => store.id !== action.payload.Acc.id
      );
    },
  },
});

export const { getAcc, insertAcc, updateAcc, removeAcc } = accSlice.actions;

export default accSlice.reducer;
