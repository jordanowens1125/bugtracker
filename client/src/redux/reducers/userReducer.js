import {ActionTypes} from '../constants/users/action-types';

function updateOne(users, payload) {
    return users.map((user) => {
        //obj.id will be equal to the payload id
      if (payload.id === user._id) {
      // update whatever you want
        let newUser = payload.project
      return newUser ;
     } else {
      return user;
     }
   })
}

const initialState = {
    users: [],
    stagedUsers:[],
} 
export const usersReducer = (state=initialState,{type,payload} ) =>{
    switch(type){
        case ActionTypes.SET_USERS:
            return {...state, users:payload}; 
        case ActionTypes.DELETE_USER:
            let newUsers = state.users.filter(user=>user._id!==payload)
            return{...state,users:newUsers}
        case ActionTypes.CREATE_USER:
            return{...state,users:[...state.users,payload]}
        case ActionTypes.UPDATE_USERS:
            return{...state,
            users:updateOne(state.users,payload)}
        default:
            return state;
    }
}
export const currentUserReducer =(state={},{type,payload})=>{
    switch(type){
        case ActionTypes.CURRENT_USER:
            return {...state,...payload}
        case ActionTypes.LOGOUT:
            return {}
        default:
            return state
    }
}
