import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  InfoOrder: {},
};

export const infoOrderSlice = createSlice({
  name: "infoOrder",
  initialState,
  reducers: {
    addInfoOrder: (state, action) => {
      state.InfoOrder = action.payload.infoOrder;
    },
    updateInfoOrder: (state, action) => {
      const cookiesInfoOrder = JSON.parse(Cookies.get("infoOrder"));
      state.InfoOrder = cookiesInfoOrder;
      return state;
    },
  },
});

export const { addInfoOrder, updateInfoOrder } = infoOrderSlice.actions;

export default infoOrderSlice.reducer;
