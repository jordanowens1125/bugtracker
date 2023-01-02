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
export const projectsReducer = (state=initialState,{type,payload} ) =>{/*projects =[], action*/
    switch(type){
        case ActionTypes.SET_PROJECTS:
            return {...state, projects:payload}; //projects
        case ActionTypes.DELETE_PROJECT:
            let newProjects = state.projects.filter(project=>project._id!==payload)
            return{...state,projects:newProjects}
        case ActionTypes.CREATE_PROJECT:
            //let newProjectList = payload
            return{...state,projects:[...state.projects,payload]}
        case ActionTypes.UPDATE_PROJECTS:
            return{...state,
            projects:updateOne(state.projects,payload)}
        default:
            return state;
    }
}

export const selectedProjectReducer =(state={},{type,payload})=>{
    switch(type){
        case ActionTypes.SELECTED_PROJECT:
            return {...state,...payload}
        case ActionTypes.REMOVE_SELECTED_PROJECT:
            return {}
        default:
            return state
    }
}

export const availableMembersReducer =(state=[],{type,payload})=>{
    switch(type){
        case ActionTypes.AVAILABLE_MEMBERS:
            return payload
        case ActionTypes.REMOVE_AVAILABLE_MEMBERS:
            return []
        default:
            return state
    }
}