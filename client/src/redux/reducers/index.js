import { combineReducers } from "redux";

import {projectsReducer,selectedProjectReducer,availableMembersReducer} from './projectReducer'
import {bugsReducer, selectedBugReducer} from './bugReducer'
import {usersReducer, currentUserReducer} from './userReducer'
export default combineReducers({
    allProjects:projectsReducer,
    project:selectedProjectReducer,
    availableMembers:availableMembersReducer,
    allBugs:bugsReducer,
    currentBug:selectedBugReducer,
    currentProjectBugs: '',
    currentProjectUsers:'',
    currentBugComments:'',
    allUsers:usersReducer,
    currentUser:currentUserReducer,
    currentUserBugs:'',
    currentUserProjects:'',
})

