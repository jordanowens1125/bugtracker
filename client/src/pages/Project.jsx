import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {selectedProject,removeSelectedProject} from '../redux/actions/projectActions'
import ProjectDashboard from '../components/ProjectDashboard/ProjectDashboard'
import EditProjectModal from '../components/Projects/EditProjectModal/EditProjectModal'
import api from '../api/index'

const Project = () => {
    const projectID =useParams().id
    const dispatch =useDispatch()

    const fetchProjectDetails = async()=>{
        try{
            const project = await api.projects.fetchProject(projectID)
            //return 1 project
            if(project.members.length>0){
               let members = project.members.map(a => a.email);
                project.members=members 
            }
            
            dispatch(selectedProject(project))
        }
        catch(err){
            console.log('Error', err)
        }
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
        </>
        
    )
}

export default Project