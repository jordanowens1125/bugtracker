import axios from 'axios'
const baseURL = "http://localhost:8000/users";
import {removeUserFromProjects } from './projects';
import {unAssignUserFromBugs} from './bugs'

export const fetchUsers = async() => await axios.get(baseURL).then((response)=>{return(response.data)})
export const createUser = async(newUser) => axios.post(`${baseURL}/create`,newUser)

export const updateUser = async(id, updatedUser) => 
    await axios.put(`${baseURL}/${id}`, updatedUser);

export const fetchUser  = async(id) => await axios.get(`${baseURL}/${id}`);
export const deleteUser = async(user) => await axios.delete(`${baseURL}/delete/${user._id}`).then(async()=>{
    //remove user from projects 
    await removeUserFromProjects(user)
    await unAssignUserFromBugs(user)
});

export const addUsersToProject= async(project)=> await axios.put(`${baseURL}/project/${project._id}`,project)
export const unAssignUsersFromProject = async(project)=>await axios.put(`${baseURL}/removeproject`,project)
