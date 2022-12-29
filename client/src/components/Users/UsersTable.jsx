import React, { useEffect } from 'react'
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { setUsers } from '../../redux/actions/userActions';
import { setProjects } from '../../redux/actions/projectActions';
import api from '../../api/index'

const filterUsers = (users)=>{
  //function to discern between members with projects and those without projects
  const userList = []
  for (let i=0;i<users.length;i++){
    if(users[i].project.length>0){
      users[i].projectDisplay = users[i].project[0].title
    }else{
      users[i].projectDisplay = '-'
    }
    userList.push(users[i])
  }
  return userList
}

const UsersTable = () => {
    const users = useSelector((state)=>state.allUsers.userDisplayList)
    const hasUsers = users.length>0
    const dispatch=useDispatch()
  useEffect(()=>{

      },[users])

    const deleteUser=async(e)=>{
      let userID = (e.currentTarget.dataset.key)
      let userToDelete=''
        for (let i=0;i<users.length;i++){
            if(users[i]._id==userID){
              userToDelete= users[i]
            }
        }
      await api.users.deleteUser(userToDelete)
      const updatedUsers= await api.users.fetchUsers()
      const updatedProjects= await api.projects.fetchProjects()
      dispatch(setUsers(updatedUsers))
      dispatch(setProjects(updatedProjects))
    }
    

  return (
    <>
        {hasUsers?
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>ID </TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Role</TableCell>
                <TableCell align="right">Assigned Project</TableCell>  
                <TableCell align="right">Assigned Bugs</TableCell> 
                <TableCell align="right">Comments</TableCell> 
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>{users.map((user) => (
                    <TableRow
                    key={[user._id,user.email]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">{user._id} </TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">{user.role}</TableCell>
                    <TableCell align="right">{user.projectDisplay}</TableCell>
                    <TableCell align="right">{user.assignedBugs.length}</TableCell> 
                    <TableCell align="right">{user.comments.length}</TableCell> 
                    <TableCell  align="right"><Link to={`${user._id}`}><button data-key={user._id}>Edit</button></Link></TableCell>
                    <TableCell align="right"><button onClick={deleteUser} data-key={user._id}>Delete</button></TableCell>
                    </TableRow>
                    ))}
            </TableBody>
        </Table>
        </TableContainer>
        :<h1>Loading</h1>
      }
    </>
  )
}

export default UsersTable