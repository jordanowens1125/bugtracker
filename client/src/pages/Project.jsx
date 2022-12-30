import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {selectedProject,removeSelectedProject} from '../redux/actions/projectActions'
import ProjectDashboard from '../components/ProjectDashboard/ProjectDashboard'
import EditProjectModal from '../components/Projects/EditProjectModal/EditProjectModal'
import api from '../api/index'
import BugComments from '../components/Bugs/BugComments/BugComments'

const Project = () => {
    const projectID =useParams().id
    const dispatch =useDispatch()

    const fetchProjectDetails = async()=>{
        const project = await api.projects.fetchProject(projectID)
        //return 1 project
        if(project.members.length>0)
        {            }
            dispatch(selectedProject(project))
        }
    useEffect(()=>{
            if(projectID && projectID!=''){
                fetchProjectDetails()
                return ()=>{
                    dispatch(removeSelectedProject())
                }
            }
    },[projectID])
    
    return (
        <>
            <ProjectDashboard/>
            <EditProjectModal/>
            <BugComments/>
        </>
        
    )
}

export default Project