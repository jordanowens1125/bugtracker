import { ActionTypes } from "../constants/bugs/action-types";

const initialState = {
    bugs: [],
} 

export const bugsReducer = (state=initialState,{type,payload} ) =>{/*bugs =[], action*/
    switch(type){
        case ActionTypes.SET_BUGS:
            return {...state, bugs:payload}; //bugs
        case ActionTypes.DELETE_BUG:
            let newBugs = state.bugs.filter(bug=>bug._id!==payload)
            return{...state,bugs:newBugs}
        case ActionTypes.CREATE_BUG:
            return{...state,bugs:[...state.bugs,payload]}
        default:
            return state;
    }
}
export const selectedBugReducer =(state={},{type,payload})=>{
    switch(type){
        case ActionTypes.SELECTED_BUG:
            return {...state,...payload}
        case ActionTypes.REMOVE_SELECTED_BUG:
            return {}
        default:
            return state
    }
}