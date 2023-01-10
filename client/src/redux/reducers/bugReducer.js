import { createReducer } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/bugs/action-types";

const initialState = {
    bugs: [],
} 

export const bugsReducer = createReducer(initialState,
    (builder)=>{
    builder
    .addCase(ActionTypes.SET_BUGS,(state,action)=>{
        state.bugs=action.payload
    })
    .addCase(ActionTypes.DELETE_BUG,(state,action)=>{
        state.bugs.filter(bug=>bug._id!==action.payload)
    })
    .addCase(ActionTypes.CREATE_BUG,(state,action)=>{
        state.bugs.push(action.payload)
    })
})

export const selectedBugReducer=createReducer({},
    (builder)=>{
    builder
    .addCase(ActionTypes.SELECTED_BUG,(state,action)=>{
        return action.payload
    })
    .addCase(ActionTypes.REMOVE_SELECTED_BUG,(state)=>{
        state={}
    })
})