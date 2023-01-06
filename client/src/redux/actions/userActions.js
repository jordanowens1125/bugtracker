import { ActionTypes } from "../constants/users/action-types"

export const setUsers =(users)=>{
    return {
        type:ActionTypes.SET_USERS,
        payload:users
    }
}
export const selectedUser = (user)=>{
    return {
        type:ActionTypes.SELECTED_USER,
        payload:user
    }
}

export const setLoginMethods = (methods)=>{
    return {
        type:ActionTypes.SET_LOGIN_METHODS,
        payload:methods
    }
}
export const removeLoginMethods = ()=>{
    return {
        type:ActionTypes.REMOVE_LOGIN_METHODS,
    }
}
export const removeSelectedUser =()=>{
    return {
        type:ActionTypes.LOGOUT,
    }
}
export const createUser = (user) =>()=>{
    return {
        type:ActionTypes.CREATE_USER,
        payload:user
    }
}
export const updateUser =(id,user)=>{
    return {
        type:ActionTypes.UPDATE_USER,
        payload:id,user
    }
}
export const deleteUser =(id)=>{
    return {
        type:ActionTypes.DELETE_USER,
        payload:id
    }
}