import React, { useMemo } from 'react'
import {useState} from 'react'
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { Paper } from '@mui/material';

const isBugAssigned=(assignedTo)=>{
    if(assignedTo){
        if(assignedTo.length>0){
            return true
        }
    }
    return false 
}

const BugDashboard = () => {
    const bug =useSelector((state)=>state.currentBug)
    const isAnyoneAssigned=isBugAssigned(bug.assignedTo)
    useMemo(() => {
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
            </Box>
        </Paper>
        
        </>  
    )
}

export default BugDashboard