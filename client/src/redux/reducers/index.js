import { combineReducers } from "redux";
import { currentUserReducer } from "./userReducer";
import { messageReducer } from "./messageReducer";
export default combineReducers({
  currentProjectBugs: "",
  currentProjectUsers: "",
  currentUser: currentUserReducer,
  currentUserBugs: "",
  currentUserProjects: "",
  message: messageReducer,
});
