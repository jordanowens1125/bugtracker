import { createReducer } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/message/action-types";

const initialState = {
    text: '',
    open: false,
};

export const messageReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.SET_MESSAGE, (state, action) => {
      state.text = action.payload;
      state.open = true;
    })
    .addCase(ActionTypes.CLEAR_MESSAGE, (state) => {
      state.text = '';
      state.open = false;
    })
});