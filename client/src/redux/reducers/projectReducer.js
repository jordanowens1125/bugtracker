import { createReducer } from '@reduxjs/toolkit';
import {ActionTypes} from '../constants/projects/action-types';

function updateOne(projects, payload) {
    return projects.map((project) => {
        //obj.id will be equal to the payload id
      if (payload.id === project._id) {
      // update whatever you want
        let newProject = payload.project
      return newProject ;
     } else {
      return project;
     }
   })
  }

const initialState = {
    projects: [],
} 

export const projectsReducer = createReducer(initialState,
    (builder)=>{
    builder
    .addCase(ActionTypes.SET_PROJECTS,(state,action)=>{
        state.projects=action.payload
    })
    .addCase(ActionTypes.DELETE_PROJECT,(state,action)=>{
        state.projects.filter(project=>project._id!==action.payload)
    })
    .addCase(ActionTypes.CREATE_PROJECT,(state,action)=>{
        state.projects.push(action.payload)
    })
    .addCase(ActionTypes.UPDATE_PROJECTS,(state,action)=>{
        state.projects=updateOne(state.projects,action.payload)
    })
})

export const selectedProjectReducer =createReducer({},
    (builder)=>{
    builder
    .addCase(ActionTypes.SELECTED_PROJECT,(state,action)=>{
        state=action.payload
        return action.payload
    })
    .addCase(ActionTypes.REMOVE_SELECTED_PROJECT,(state)=>{
        return {}
    })
})

export const availableMembersReducer =createReducer([],(builder)=>{
    builder
    .addCase(ActionTypes.AVAILABLE_MEMBERS,(state,action)=>{
        state=action.payload
        return action.payload
    })
    .addCase(ActionTypes.REMOVE_SELECTED_PROJECT,(state)=>{
        return []
    })
})
