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

const filterUsers = (users)=>{
    //function to discern between members with projects and those without projects
    const userList = []
    const assignedUsers=[]
    const unAssignedUsers=[]
    for (let i=0;i<users.length;i++){
      if(users[i].project.length>0){
        users[i].projectDisplay = users[i].project[0].title
      }else{
        users[i].projectDisplay = '-'
      }
      if(users[i].project>0){
        assignedUsers.push(users[i])
      }
      else{
        unAssignedUsers.push(users[i])
      }
      userList.push(users[i])
    }
    return [userList,assignedUsers,unAssignedUsers]
  }

const initialState = {
    users: [],
    userDisplayList:[],
    assignedUsers:[],
    unAssignedUsers:[],
} 
export const usersReducer = (state=initialState,{type,payload} ) =>{
    switch(type){
        case ActionTypes.SET_USERS:
            let [userList,assignedUsers,unAssignedUsers] = filterUsers(JSON.parse(JSON.stringify(payload)))

            return {...state, users:payload,
                userDisplayList:userList,
                assignedUsers:assignedUsers,
                unAssignedUsers:unAssignedUsers,
            }; 
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
