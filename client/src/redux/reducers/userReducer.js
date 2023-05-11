import { createReducer } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/users/action-types";

function updateOne(users, payload) {
  return users.map((user) => {
    //obj.id will be equal to the payload id
    if (payload.id === user._id) {
      // update whatever you want
      let newUser = payload.project;
      return newUser;
    } else {
      return user;
    }
  });
}

const initialState = {
  users: [],
};

export const usersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.SET_USERS, (state, action) => {
      state.users = action.payload;
    })
    .addCase(ActionTypes.DELETE_USER, (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    })
    .addCase(ActionTypes.CREATE_USER, (state, action) => {
      state.users.push(action.payload);
    })
    .addCase(ActionTypes.UPDATE_USERS, (state, action) => {
      state.users = updateOne(state.users, action.payload);
    });
});

export const currentUserReducer = createReducer({}, (builder) => {
  builder
    .addCase(ActionTypes.SELECTED_USER, (state, action) => {
      state = action.payload;
      return action.payload;
    })
    .addCase(ActionTypes.LOGOUT, (state, action) => {
      state = {};
      return {};
    });
});
