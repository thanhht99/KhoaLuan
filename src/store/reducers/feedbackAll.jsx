import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Feedback: [],
};

export const feedbackSlice = createSlice({
  name: "feedbackAll",
  initialState,
  reducers: {
    insertFeedback: (state, action) => {
      state.Feedback = action.payload.newFeedback;
    },
    resetFeedback: () => initialState,
  },
});

export const { insertFeedback, resetFeedback } = feedbackSlice.actions;

export default feedbackSlice.reducer;
