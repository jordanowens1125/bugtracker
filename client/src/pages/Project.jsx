import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {selectedProject,removeSelectedProject} from '../redux/actions/projectActions'
import ProjectDashboard from '../components/ProjectDashboard/ProjectDashboard'
import EditProjectModal from '../components/Projects/EditProjectModal/EditProjectModal'
import axios from 'axios'

const Project = () => {
    const projectID =useParams().id
    const dispatch =useDispatch()
    const projectURL = `http://localhost:8000/projects/${projectID}`;

    const fetchProjectDetails = async()=>{
        try{
            const response = await axios.get(projectURL)
            //return 1 project
            dispatch(selectedProject(response.data))
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
    const project =useSelector((state)=>state.project)
    
    return (
        <>
            <ProjectDashboard project={project} />
            <EditProjectModal/>
        </>
        
    )
}

export default Project