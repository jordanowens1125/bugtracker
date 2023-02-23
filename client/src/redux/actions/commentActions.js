import { ActionTypes } from "../constants/comments/action-types";

export const setComments = (comments) => {
  return {
    type: ActionTypes.SET_COMMENTS,
    payload: comments,
  };
};
export const removeComments = () => {
  return {
    type: ActionTypes.REMOVE_COMMENTS,
  };
};


}
