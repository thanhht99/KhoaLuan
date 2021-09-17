import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  User: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getListUser: (state, action) => {
      state.User = action.payload.User;
    },
    insertUser: (state, action) => {
      state.User = action.payload.newUser;
    },
    updateUser: (state, action) => {
      const { updatedData } = action.payload;
      state.User = state.User.map((store) => {
        if (store.id !== updatedData.id) return store;
        return updatedData;
      });
    },
    removeUser: (state, action) => {
      state.User = state.User.filter(
        (store) => store.id !== action.payload.User.id
      );
    },
  },
});

export const { getListUser, insertUser, updateUser, removeUser } =
  userSlice.actions;

export default userSlice.reducer;
