import { combineReducers } from "redux";

import {projectsReducer,selectedProjectReducer,availableMembersReducer} from './projectReducer'
import {bugsReducer, selectedBugReducer} from './bugReducer'
import {commentsReducer} from './commentsReducer'
import {usersReducer, currentUserReducer,loginMethodsReducer} from './userReducer'
export default combineReducers({
    allProjects:projectsReducer,
    project:selectedProjectReducer,
    availableMembers:availableMembersReducer,
    allBugs:bugsReducer,
    currentBug:selectedBugReducer,
    currentProjectBugs: '',
    currentProjectUsers:'',
    currentBugComments:commentsReducer,
    allUsers:usersReducer,
    currentUser:currentUserReducer,
    currentUserBugs:'',
    currentUserProjects:'',
    loginMethods:loginMethodsReducer,
})

