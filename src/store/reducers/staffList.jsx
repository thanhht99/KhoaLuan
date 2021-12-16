import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  StaffList: [],
};

export const staffListSlice = createSlice({
  name: "staffList",
  initialState,
  reducers: {
    insertStaffList: (state, action) => {
      state.StaffList = action.payload.newStaffList;
    },
    resetStaffList: () => initialState,
  },
});

export const { insertStaffList, resetStaffList } = staffListSlice.actions;

export default staffListSlice.reducer;
