import React, { useMemo,useEffect,useState } from 'react'
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux'
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

  function checkProject(project){
    if(project.bugs){
        return true
    }else{
        return false
    }
  }

const ProjectDashboard = () => {
    const project =useSelector((state)=>state.project)
    const isCurrentProjectFilled = checkProject(project)
    const users =useSelector((state)=>state.allUsers.users)
    const [formInputData, setFormInputData] = useState({
        title:'',
        description:'',
        status:'',
        startDate: '',
        deadline: '',
        history:'',
        members:'',//replaceIDsWithEmails(members,users)
        bugs:'',
    })
    useEffect(() => {
    },[project]);
    return (
        <>{isCurrentProjectFilled ?
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
                    {project.bugs.map((bug)=>(
                        <h1 key={bug._id}>{bug.title}</h1>
                    ))}
                    {project.members.map((member)=>(
                        <h1 key={member}>{member}</h1>
                    ))}
                    <h1> {project.history}</h1> 
            </Box>:'Loading'
        }
        </>  
    )
}

export default ProjectDashboard