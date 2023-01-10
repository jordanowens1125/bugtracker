import React, { useMemo,useEffect,useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './ProjectDashboard.css'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import {DataGrid} from '@mui/x-data-grid';
import api from '../../api/index'
import {selectedBug, setBugs} from '../../redux/actions/bugActions'
import {selectedProject,setProjects} from '../../redux/actions/projectActions'
import {setUsers} from '../../redux/actions/userActions'

function BugsDataGridTitle() {
  return(
      <Box style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Typography variant="h5"> Project Bugs</Typography>
      </Box>
  )
}
function MembersDataGridTitle() {
  return(
      <Box style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Typography variant="h5">Project Users</Typography>
          <div></div>
      </Box>
  )
}
const bugColumns = [
    { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'title',
      headerName: 'Title',
      description: 'This column has a value getter and is not sortable.',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: true,
    },
    {
      field: 'openDate',
      headerName: 'Open Date',
      width: 100,
      editable: true,
    },
    {
        field: 'closeDate',
        headerName: 'Close Date',
        width: 100,
        editable: true,
      },
      {
        field: 'priority',
        headerName: 'Priority',
        width: 100,
        editable: true,
      },
];

  function checkProject(project){
    if(project.bugs){
        return true
    }else{
        return false
    }
  }

  const findMatchingBug=(bugID,bugs)=>{
    for(let i=0;i<bugs.length;i++){
        if(bugs[i]._id==bugID){
            return bugs[i]
        }
    }
  }

const ProjectDashboard = () => {
    const project =useSelector((state)=>state.project)
    const isCurrentProjectFilled = checkProject(project)
    const bugs = useSelector((state)=>state.allBugs.bugs)
    const currentBug = useSelector((state)=>state.currentBug)
    const dispatch=useDispatch()
    useEffect(() => {
    },[project]);

    const removeUser=async(e,row)=>{
      await api.users.unAssignUserFromProject(row)
      const updatedUsers = await api.users.fetchUsers()
      const updatedProjects = await api.projects.fetchProjects()
      const updatedProject = await api.projects.fetchProject(row.project)
      const updatedBugs = await api.bugs.fetchBugs()
      if (currentBug.assignedTo){
        const updatedBug = await api.bugs.fetchBug(currentBug._id)
        dispatch(selectedBug(updatedBug))
      }
      dispatch(setBugs(updatedBugs))
      dispatch(setUsers(updatedUsers))
      dispatch(setProjects(updatedProjects))
      dispatch(selectedProject(updatedProject))
    }

    const memberColumns = [
      { field: '_id', headerName: 'ID', width: 90 },
      {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
          `${params.row.firstName || ''} ${params.row.lastName || ''}`||`-`,
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 150,
        editable: true,
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 100,
        editable: true,
      },
      {
          field: 'Bug Count',
          headerName: 'Bug Count',
          width: 100,
          editable: true,
          valueGetter:(params)=>
              `${params.row.assignedBugs.length}`
        },
        ,
      {
        field:'Remove User',
          width: 100,
          renderCell:(params)=>{
            return(
            <Button onClick={(e)=>removeUser(e,params.row)} variant="contained" color="error" >Remove</Button>)
          }
        }
    ];
    const handleRowClick=(e)=>{
        const foundBug = findMatchingBug(e.id,bugs)
        dispatch(selectedBug(foundBug))
    }
    return (
        <>{isCurrentProjectFilled ?
            <Box className='project-dashboard' sx={{ height: 400, 
            width: '100%',display:{xs:'block',sm:'block',md:'block', lg:'flex'}}}
            >
            <DataGrid
              sx={{width:{sm:'100%',md:'100%' }}}
              rows={project.members}
              columns={memberColumns}
              getRowId={(row)=>row._id}
              pageSize={6}
              rowsPerPageOptions={[6]}
              //disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              components={{Toolbar:MembersDataGridTitle}}
            />
            <DataGrid
              sx={{width:{xs:'100%',sm:'100%',md:'100%' },marginTop:{xs:'10%',sm:'10%',md:'10%',lg:'0%'}}}
              rows={project.bugs}
              columns={bugColumns}
              getRowId={(row)=>row._id}
              pageSize={6}
              rowsPerPageOptions={[6]}
              experimentalFeatures={{ newEditingApi: true }}
              onRowClick={handleRowClick}
              components={{Toolbar:BugsDataGridTitle}}
              //checkboxSelection
              //disableSelectionOnClick
            />
          </Box>
            :'No Project Currently Selected'
        }
        </>  
    )
}

export default ProjectDashboard