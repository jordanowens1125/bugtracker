import React from 'react'
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import {useSelector, useDispatch} from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/index';
import {setBugs,selectedBug} from '../../../redux/actions/bugActions'
import {selectedProject, setProjects} from '../../../redux/actions/projectActions'
import dayjs from 'dayjs'

const BugsTable = () => {
  const [open, setOpen] = useState(false);
  const projects = useSelector((state)=>state.allProjects.projects)
  const bugs = useSelector((state)=>state.allBugs.bugs)
  const dispatch =useDispatch()
  const navigate = useNavigate()
  const hasBugs = bugs.length>0
  //if there are no projects then there should not be any bugs
  useEffect(()=>{
  },[bugs])

  const handleEditClick=async(e)=>{
    let bugID = (e.currentTarget.dataset.key)
    const bug = await api.bugs.fetchBug(bugID)
    const project = await api.projects.fetchProject(bug.projectID)
    dispatch(selectedBug(bug))
    dispatch(selectedProject(project))
    navigate(`/bugs/${bugID}`)
}

const handleDeleteClick=async(e)=>{
  let [bugID,projectID] = (e.currentTarget.dataset.key).split(',')
  await api.bugs.deleteBug(bugID,projectID)
  //make modal popup
  //update bugs for redux
  const updatedProjects = await api.bugs.fetchBugs()
  dispatch(setBugs(updatedProjects))
  //update projects for redux
  const newProjects = await api.projects.fetchProjects()
  dispatch(setProjects(newProjects))
}

  return (
    <>
      {hasBugs?
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>ID </TableCell>
                <TableCell>Bug(Title) </TableCell>
                <TableCell align="right">Open Date</TableCell>
                <TableCell align="right">Priority</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Project</TableCell> 
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>{bugs.map((bug) => (
                    <TableRow
                    key={bug._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">{bug._id} </TableCell>
                    <TableCell>
                        {bug.title}
                    </TableCell>
                    <TableCell align="right">{dayjs(bug.openDate).format('YYYY-MM-DD')}</TableCell>
                    <TableCell align="right">{bug.priority}</TableCell>
                    <TableCell align="right">{bug.status}</TableCell>
                    <TableCell align="right">{bug.projectID.title}</TableCell>
                    <TableCell  align="right"><button data-key={bug._id} onClick ={handleEditClick}>Edit</button></TableCell>
                    <TableCell align="right"><button onClick={handleDeleteClick} data-key={[bug._id,bug.projectID._id]}>Delete</button></TableCell>
                    </TableRow>
                    ))
            }</TableBody>
        </Table>
        </TableContainer>
        :<h1>Loading</h1>
      }
    </>
    
  )
}

export default BugsTable