import React, { useMemo } from 'react'
import {useState} from 'react'
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux'
import NamesDropDown from './NamesDropDown/NamesDropDown'
import dayjs from 'dayjs'

//function to turn ids into emails for project members
function replaceIDsWithEmails(ids, users) {
    let userEmails =[];
    if(ids){
       if(ids.length>0){
      for(let i=0;i<users.length;i++){
        if(ids.includes(users[i]._id)){
            userEmails.push(users[i].email)
        }
      } 
    } 
    }
    return(userEmails)  
  }

const ProjectDashboard = () => {
    const project =useSelector((state)=>state.project)
    const users =useSelector((state)=>state.allUsers.users)
    let {title, description, status,startDate, deadline, history, members,bugs} = project
    const [formInputData, setFormInputData] = useState({
        title:title,
        description:description,
        status:status,
        startDate: startDate,
        deadline: deadline,
        history:history,
        members:replaceIDsWithEmails(members,users),
        bugs:bugs,
    })
    useMemo(() => {
        setFormInputData(project)
    },[project]);
    return (
        <>
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
                <h1>hiiiiiiii</h1>
                <h1>hiiiiiiii</h1>
                <h1> {project.title}</h1>
                <h1> {project.description}</h1>
                <h1> {project.startDate}</h1>
                <h1> {project.deadline}</h1>
                <h1> {project.status}</h1>
                <h1> {project.bugs}</h1>
                <h1> {project.members}</h1>
                <h1> {project.history}</h1> 
        </Box>
        </>  
    )
}

export default ProjectDashboard