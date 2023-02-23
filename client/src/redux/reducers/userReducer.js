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

const filterUsers = (users) => {
  //function to discern between members with projects and those without projects
  const userList = [];
  const assignedUsers = [];
  const unAssignedUsers = [];
  const deletedUser = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].role !== "Deleted" && users[i].role !== "Admin") {
      if (users[i].project.length > 0) {
        users[i].projectDisplay = users[i].project[0].title;
      } else {
        users[i].projectDisplay = "-";
      }
      if (users[i].project.length > 0) {
        assignedUsers.push(users[i]);
      } else {
        //only developers can be here
        if (users[i].role === "Developer") {
          unAssignedUsers.push(users[i]);
        }
      }
      userList.push(users[i]);
    } else {
      if (users[i].role !== "Admin") {
        deletedUser.push(users[i]);
      }
    }
  }
  return [userList, assignedUsers, unAssignedUsers, deletedUser];
};

const initialState = {
  users: [],
  userDisplayList: [],
  assignedUsers: [],
  unAssignedUsers: [],
  deletedUser: [],
};

export const usersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.SET_USERS, (state, action) => {
      let [userList, assignedUsers, unAssignedUsers, deletedUser] = filterUsers(
        JSON.parse(JSON.stringify(action.payload))
      );
      state.users = action.payload;
      state.userDisplayList = userList;
      state.assignedUsers = assignedUsers;
      state.unAssignedUsers = unAssignedUsers;
      state.deletedUser = deletedUser;
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
