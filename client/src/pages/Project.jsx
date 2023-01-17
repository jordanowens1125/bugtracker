import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {selectedProject,removeSelectedProject, removeAvailableMembers, setAvailableMembers} from '../redux/actions/projectActions'
import ProjectDashboard from '../components/ProjectDashboard/ProjectDashboard'
import EditProjectModal from '../components/Projects/EditProjectModal/EditProjectModal'
import api from '../api/index'
import BugComments from '../components/Bugs/BugComments/BugComments'
import { removeSelectedBug } from '../redux/actions/bugActions'
import CreateBugModal from '../components/Bugs/CreateBugModal/CreateBugModal'

const Project = () => {
    const projectID =useParams().id
    const dispatch =useDispatch()
    const unAssignedUsers = useSelector((state)=>state.allUsers.unAssignedUsers)
    const fetchProjectDetails = async()=>{
        const project = await api.projects.fetchProject(projectID)
        //return 1 project
            const availableMembers = project.members.concat(unAssignedUsers)
            dispatch(setAvailableMembers(availableMembers))
            dispatch(selectedProject(project))
        }
    useEffect(()=>{
            if(projectID && projectID!=''){
                fetchProjectDetails()
                return ()=>{
                    dispatch(removeSelectedProject())
                    dispatch(removeAvailableMembers())
                    //dispatch(removeSelectedBug())
                }
            }
    },[projectID])
    return (
        <>
            <EditProjectModal/>
            <ProjectDashboard/>
        </>
    )
}

export default Project