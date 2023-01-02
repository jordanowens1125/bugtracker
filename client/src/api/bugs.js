import axios from 'axios'
import {addBugToProject,deleteBugFromProject} from './projects'
import {assignBugToUser,unAssignBugFromUser} from './users'
import {deleteBugComments} from './comments'
const baseURL = "http://localhost:8000/bugs";

export const fetchBugs = () => axios.get(baseURL).then((response)=>{return(response.data)})
export const createBug =(newBug) => axios.post(`${baseURL}/create`,newBug).then(async(bugResponse)=>{
    const projectID = (bugResponse.data.projectID)
    const bugID=bugResponse.data._id
    const project =await addBugToProject(projectID,bugID)
    if(newBug.assignedTo.length>0){
        assignBugToUser(bugResponse.data)
    }
    //result holds the project
    return({project:project,newBug:bugResponse.data})
})
export const updateBug = async(currentBug, updatedBug) => {
    await axios.put(`${baseURL}/${currentBug._id}`, updatedBug)
        .then(async(response)=>{
            //if they don't equal then 
            if(updatedBug.assignedTo!==currentBug.assignedTo){
            //check if the current bug has an assignedTo value
            if(currentBug.assignedTo){
                await unAssignBugFromUser(currentBug)
            }
            if(updatedBug.assignedTo){
                await assignBugToUser(updatedBug)
            }
        }
        return (response.data)
        //if they equal then do nothing
        });
}
    
export const fetchBug = (id) => axios.get(`${baseURL}/${id}`)
    .then((response)=>{return response.data});
    
export const deleteAllProjectBugs = (projectID) => 
    axios.delete(`${baseURL}/delete/project/${projectID}`)

export const deleteBug = (bugID,projectID) => 
    axios.delete(`${baseURL}/delete/${bugID}`)
        .then(async()=>{
            await deleteBugFromProject(bugID,projectID)
            await deleteBugComments(bugID)
});

export const unAssignUserFromBugs=async(user)=>
    await axios.put(`${baseURL}/unassignuser`,user)

export const addCommentToBug=async(bugID,commentID)=>
    await axios.put(`${baseURL}/addcomment`,{bugID:bugID,commentID:commentID})
        .then((response)=>{
            return response.data
        })