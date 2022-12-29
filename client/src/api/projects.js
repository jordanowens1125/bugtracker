import axios from 'axios'
const baseURL = "http://localhost:8000/projects";
import {deleteAllProjectBugs} from './bugs'
import { addUsersToProject,unAssignUsersFromProject } from './users';
import { deleteAllProjectComments } from './comments';

export const fetchProjects = async() => await axios.get(baseURL).then((response)=>{return(response.data)})
export const createProject = async(newProject) => await axios.post(`${baseURL}/create`,newProject).then(async(response)=>{
        //api call to add project to selected users
        const project = response.data
        if(project.members.length>0){
            const rest = await addUsersToProject(project)
        }
    }
)
    
export const updateProject = async(id, oldProject, updatedProject) => {
    await unAssignUsersFromProject(oldProject)
    await axios.put(`${baseURL}/${id}`, updatedProject);
    if(updatedProject.members.length>0){
        const rest = await addUsersToProject(updatedProject)
    }
}
    
export const addBugToProject =async(id,newBugID)=> await axios.put(`${baseURL}/${id}/addnewbug`,{bugID:newBugID})
    .then((response)=>{
        return response.data
})

export const deleteBugFromProject =async(bugID,projectID)=> await axios.put(`${baseURL}/${projectID}/deletebug/${bugID}`)
export const fetchProject  = async(id) => await axios.get(`${baseURL}/${id}`).then((response)=>{return response.data});;
export const deleteProject = async(project) => await axios.delete(`${baseURL}/delete/${project._id}`).then(async()=>{
    //delete its associated bugs
    await deleteAllProjectBugs(project._id)
    //delete the comments associated with these bugs
    await deleteAllProjectComments(project._id)
    await unAssignUsersFromProject(project)
});

export const removeUserFromProjects=async(user)=>await axios.put(`${baseURL}/removeuser`,user)