import { ActionTypes } from "../constants/message/action-types";

export const setMessage = (message) => {
  return {
      type: ActionTypes.SET_MESSAGE,
      payload: message,
  };
};

export const clearMessage = () => {
  return {
    type: ActionTypes.CLEAR_MESSAGE,
  };
};

export const setOpenToTrue = () => {
  return {
    type: ActionTypes.SET_OPEN_TO_TRUE,
  };
};

export const setOpenToFalse = () => {
  return {
    type: ActionTypes.SET_OPEN_TO_FALSE,
  }
}