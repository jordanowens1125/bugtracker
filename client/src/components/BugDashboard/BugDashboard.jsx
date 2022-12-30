import React, { useMemo } from 'react'
import {useState} from 'react'
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { Paper } from '@mui/material';

const setBugToUnassigned=(assignedTo)=>{
    if(assignedTo){
        if(assignedTo.length>0){
            return true
        }
    }
    return false 
}

const BugDashboard = () => {
    const bug =useSelector((state)=>state.currentBug)
    const isAnyoneAssigned=setBugToUnassigned(bug.assignedTo)
    //const email = bug.assignedTo.length>0||false
    let {_id,title, description, status,openDate, closeDate, creator,
        priority,assignedTo,relatedBugs,projectID,comments,closer,
        stepsToRecreate,history} = bug
    const [formInputData, setFormInputData] = useState({
        title:title,
        creator:creator,
        description:description,
        status:status,
        openDate: openDate,
        closeDate: closeDate,
        priority:priority,
        assignedTo: assignedTo,
        relatedBugs:relatedBugs,
        projectID:projectID,
        comments:comments,
        stepsToRecreate:stepsToRecreate,
        history:history,
        closer:closer,
    })
    useMemo(() => {
        setFormInputData(bug)
    },[bug]);
    return (
        <>
        <Paper elevation={5}>
            <Box p={3}
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
                <h1> {bug.title}</h1>
                <h1> {bug.description}</h1>
                <h1> {dayjs(bug.openDate).format('YYYY-MM-DD')}</h1>
                <h1> {bug.status}</h1>
                <h1> {bug.priority}</h1>
                {isAnyoneAssigned?
                <h1>{bug.assignedTo}</h1>
                    :<h1>Unassigned</h1>
                }
            </Box>
        </Paper>
        
        </>  
    )
}

export default BugDashboard