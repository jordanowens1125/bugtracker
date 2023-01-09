import axios from 'axios'
const baseURL = import.meta.env.VITE_BASELINE_URL+'users';
import {removeUserFromProjects } from './projects';
import {unAssignUserFromBugs} from './bugs'
import {setDeletedUserComments} from './comments'

export const fetchUsers = async() => await axios.get(baseURL).then((response)=>{return(response.data)})
export const createUser = async(newUser) => await axios.post(`${baseURL}/create`,newUser).then((response)=>{
        
    return (response.data)
})
export const addUserComment=async(userID,commentID)=>await axios.put(`${baseURL}/addusercomment`,{userID:userID,commentID:commentID})
export const updateUser = async(id, updatedUser) => 
    await axios.put(`${baseURL}/${id}`, updatedUser)

export const fetchUser  = async(id) => await axios.get(`${baseURL}/${id}`).then((response)=>{
    return response.data
});
export const deleteUser = async(user) => await axios.delete(`${baseURL}/delete/${user._id}`,user)
    .then(async()=>{
        //remove user from projects 
        await removeUserFromProjects(user)
        await unAssignUserFromBugs(user)
        if(user.comments.length>0){
            await setDeletedUserComments(user)
        }
});
export const clearUserBugs=async(user)=>await axios.put(`${baseURL}/clearuserbugs`,user)
export const addUsersToProject= async(project)=> await axios.put(`${baseURL}/project/${project._id}`,project)
//remove all users from a project
export const unAssignUsersFromProject = async(project)=>await axios.put(`${baseURL}/removeproject`,project)
//clear project/bug list from user
export const unAssignUserFromProject = async(user)=>await axios.put(`${baseURL}/unassignuserfromproject`,user)
.then(async()=>{
    //removes user from bugs
    await unAssignUserFromBugs(user)
    //remove user from project
    await removeUserFromProjects(user)
})
export const assignBugToUser=async(bug)=>await axios.put(`${baseURL}/assignbugtouser/${bug.assignedTo}/${bug._id}`,bug)
export const unAssignBugFromUser=async(bug)=>await axios.put(`${baseURL}/unassignbugfromuser`,bug)
