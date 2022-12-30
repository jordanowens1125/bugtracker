import { ActionTypes } from "../constants/projects/action-types"

export const setProjects =(projects)=>{
    return {
        type:ActionTypes.SET_PROJECTS,
        payload:projects
    }
}
export const selectedProject = (project)=>{
    return {
        type:ActionTypes.SELECTED_PROJECT,
        payload:project
    }
}
export const removeSelectedProject =()=>{
    return {
        type:ActionTypes.REMOVE_SELECTED_PROJECT,
    }
}
export const createProject = (project) =>{
    return {
        type:ActionTypes.CREATE_PROJECT,
        payload:project
    }
}
export const updateProjects =(id,project)=>{
    return {
        type:ActionTypes.UPDATE_PROJECTS,
        payload:{id,project}
    }
}
export const deleteProject =(id)=>{
    return {
        type:ActionTypes.DELETE_PROJECT,
        payload:id
    }
}

export const setAvailableMembers=(members)=>{
    return{
        type:ActionTypes.AVAILABLE_MEMBERS,
        payload:members
    }
}

export const removeAvailableMembers=()=>{
    return{
        type:ActionTypes.REMOVE_AVAILABLE_MEMBERS,
    }
}