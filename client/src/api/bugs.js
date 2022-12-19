import axios from 'axios'
import {addBugToProject,deleteBugFromProject} from './projects'
const baseURL = "http://localhost:8000/bugs";

export const fetchBugs = () => axios.get(baseURL).then((response)=>{return(response.data)})
export const createBug =(newBug) => axios.post(`${baseURL}/create`,newBug).then(async(bugResponse)=>{
    const projectID = (bugResponse.data.projectID)
    const bugID=bugResponse.data._id
    const project =await addBugToProject(projectID,bugID)
    //result holds the project
    return({project:project,newBug:newBug})
})
export const updateBug = (id, updatedBug) => 
    axios.put(`${baseURL}/${id}`, updatedBug);

export const fetchBug = (id) => axios.get(`${baseURL}/${id}`)
    .then((response)=>{return response.data});
    
export const deleteAllProjectBugs = (projectID) => 
    axios.delete(`${baseURL}/delete/project/${projectID}`)

export const deleteBug = (bugID,projectID) => 
    axios.delete(`${baseURL}/delete/${bugID}`)
        .then(async()=>{
            await deleteBugFromProject(bugID,projectID)
});

export const unAssignUserFromBugs=async(user)=>await axios.put(`${baseURL}/unassignuser`,user)