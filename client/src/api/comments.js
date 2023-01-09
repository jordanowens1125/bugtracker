const axios = require('axios')
const baseURL = import.meta.env.VITE_BASELINE_URL+"comments";
import {addCommentToBug} from './bugs'
import { addCommentToProject } from './projects';
import {addUserComment} from './users'

export const fetchBugComments=async(bugID)=> axios.get(`${baseURL}/${bugID}`).then((response)=>{
    return(response.data)
})

export const createComment= async(newComment)=>await axios.post(`${baseURL}/create`,newComment)
    .then(async(response)=>{
        await addCommentToBug(response.data.bugID,response.data._id)
        await addUserComment(response.data.creator,response.data._id)
        await addCommentToProject(response.data.projectID,response.data._id)
    })

export const deleteBugComments=async(bugID)=>await axios.delete(`${baseURL}/bug/${bugID}`)
export const deleteAllProjectComments=async(projectID)=>await axios.delete(`${baseURL}/project/${projectID}`)
export const setDeletedUserComments=async(user)=>await axios.put(`${baseURL}/setdeletedusercomments`,user)