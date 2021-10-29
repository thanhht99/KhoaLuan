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
    changeIsError2: (state, action) => {
      const cookiesInfoOrder = JSON.parse(Cookies.get("infoOrder"));
      cookiesInfoOrder.isError2 = true;
      let json_InfoOrder = JSON.stringify(cookiesInfoOrder);
      Cookies.set("infoOrder", json_InfoOrder, { path: "/" });
      state.InfoOrder = cookiesInfoOrder;
      return state;
    },
    resetInfoOrder: () => {
      const infoOrder = {
        address: null,
        email: null,
        fullName: null,
        phone: null,
        note: null,
        voucherCode: null,
        isError: true,
      };
      let json_infoOrder = JSON.stringify(infoOrder);
      Cookies.set("infoOrder", json_infoOrder, { path: "/" });
      return initialState;
    },
  },
});

export const { addInfoOrder, updateInfoOrder, changeIsError2, resetInfoOrder } =
  infoOrderSlice.actions;

export default infoOrderSlice.reducer;
