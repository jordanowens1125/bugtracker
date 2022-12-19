import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {  useDispatch } from 'react-redux'
import api from '../api/index'
import { selectedBug,removeSelectedBug } from '../redux/actions/bugActions'
import BugDashboard from '../components/BugDashboard/BugDashboard'
import EditBugModal from '../components/Bugs/EditBugModal/EditBugModal'
const Bug = () => {
    const bugID =useParams().id
    const dispatch =useDispatch()
    useEffect(()=>{
        async function fetchData(){
            const bug = await api.bugs.fetchBug(bugID)
            dispatch(selectedBug(bug))
        }
        fetchData()
        if(bugID && bugID!=''){
            return ()=>{
                dispatch(removeSelectedBug())
            }
        } 
    },[bugID])
    
    return (
        <>
            <BugDashboard  />
            <EditBugModal  />
        </>
        
    )
}

export default Bug 