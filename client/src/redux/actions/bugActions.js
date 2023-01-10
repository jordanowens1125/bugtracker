import { ActionTypes } from "../constants/bugs/action-types"

export const setBugs =(bugs)=>{
    return {
        type:ActionTypes.SET_BUGS,
        payload:bugs
    }
}
export const selectedBug = (bug)=>{
    return {
        type:ActionTypes.SELECTED_BUG,
        payload:bug
    }
}
export const removeSelectedBug =()=>{
    return {
        type:ActionTypes.REMOVE_SELECTED_BUG,
    }
}
export const createBug = (bug) =>()=>{
    return {
        type:ActionTypes.CREATE_BUG,
        payload:bug
    }
}
export const updateBug =(id,bug)=>{
    return {
        type:ActionTypes.UPDATE_BUG,
        payload:id,bug
    }
}
export const deleteBug =(id)=>{
    return {
        type:ActionTypes.DELETE_BUG,
        payload:id
    }
}