import { createReducer } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/comments/action-types";

export const commentsReducer = createReducer([], (builder) => {
  builder
    .addCase(ActionTypes.SET_COMMENTS, (state, action) => {
      return action.payload;
    })
    .addCase(ActionTypes.REMOVE_COMMENTS, (state) => {
      return [];
    });
});
