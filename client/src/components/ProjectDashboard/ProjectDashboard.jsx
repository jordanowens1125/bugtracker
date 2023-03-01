import React, { useMemo,useEffect,useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './ProjectDashboard.css'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import {DataGrid} from '@mui/x-data-grid';
import api from '../../api/index'
import {selectedBug, setBugs} from '../../redux/actions/bugActions'
import { setComments } from '../../redux/actions/commentActions'
import {selectedProject,setProjects} from '../../redux/actions/projectActions'
import {setUsers} from '../../redux/actions/userActions'
import CreateBugModal from '../Bugs/CreateBugModal/CreateBugModal'
import BugDashboard from '../Bugs/BugDashboard/BugDashboard'

function BugsDataGridTitle() {
  return(
      <Box style={{width: "100%", display: "flex", flexDirection:'column',justifyContent: "center", alignItems: "center"}}>
          <Typography variant="h5"> Project Bugs</Typography>
          <Typography variant="h5"> Select A Bug Below</Typography>
          <CreateBugModal/>
      </Box>
  )
}

const checkIfUserIsAdmin = (user) => {
  if (user)
  {
    if (user.role === 'Admin')
    {
      return true
    }
  }
  return false
}

function MembersDataGridTitle() {
  return(
      <Box style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Typography variant="h5">Project Users</Typography>
          <div></div>
      </Box>
  )
}

  function checkProject(project){
    if(project.bugs){
        return true
    }else{
        return false
    }
  }

  const findMatchingBug=(bugID,bugs)=>{
    for(let i=0;i<bugs.length;i++){
        if(bugs[i]._id===bugID){
            return bugs[i]
        }
    }
  }

const ProjectDashboard = () => {
    const user = useSelector((state)=>state.currentUser)
    const isAdminUser = checkIfUserIsAdmin(user)
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
        const updatedComments = await api.comments.fetchBugComments(currentBug._id)    
        dispatch(setComments(updatedComments))
      }
      dispatch(setBugs(updatedBugs))
      dispatch(setUsers(updatedUsers))
      dispatch(setProjects(updatedProjects))
      dispatch(selectedProject(updatedProject))
    }

    const memberColumns = [
      //{ field: '_id', headerName: 'ID', width: 90 },
      // {
      //   field: 'fullName',
      //   headerName: 'Full name',
      //   description: 'This column has a value getter and is not sortable.',
      //   sortable: false,
      //   width: 160,
      //   valueGetter: (params) =>
      //     `${params.row.firstName || ''} ${params.row.lastName || ''}`||`-`,
      // },
      {
        field: 'email',
        headerName: 'Email',
        width: 250,
        editable: true,
      },
      {
        field:'Remove User',
          width: 100,
          renderCell:(params)=>{
            return (
              <>
                {isAdminUser ? (
                  <>
                    <Button
                      onClick={(e) => removeUser(e, params.row)}
                      variant="contained"
                      color="error"
                      aria-label="Remove user from project"
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <>-</>
                )}
              </>
            );
          }
        }
    ];
    const handleRowClick=async(e,row)=>{
        const foundBug = findMatchingBug(row._id,bugs)
        dispatch(selectedBug(foundBug))
        const updatedComments = await api.comments.fetchBugComments(foundBug._id)
        dispatch(setComments(updatedComments))
    }
    const bugColumns = [
      {
        field:'title',
        headerName: 'Title',
        width: 300,
        headerAlign: 'center',
        align:'center',
        renderCell:(params)=>{
          return (
            <Button
              fullWidth
              variant="contained"
              key={params.id}
              onClick={(e) => handleRowClick(e, params.row)}
              aria-label="Populate selected bug below"
            >
              {params.row.title}
            </Button>
          );
        }
      }, 
        {
          field: 'status',
          headerName: 'Status',
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
    return (
        <>{isCurrentProjectFilled ?
          <>
            <Box
              sx={{ 
                height: 800, display:'grid',
                minWidth:500,
              gridTemplateAreas:{
                lg:`"users bugs"`,
                md:`
                "users" 
                "bugs"
              `, 
                sm:
                `
                "users"
                "bugs"
                `,
                xs:
                `"users"
                "bugs"`
            },
                gap:5,
                padding:'2%',
                width: '96%',
            }}
              >
              <DataGrid 
                sx={{minWidth:500, minHeight:250,gridArea:'users', }}
                rows={project.members}
                columns={memberColumns}
                getRowId={(row)=>row._id}
                pageSize={2}
                rowsPerPageOptions={[2]}
                //disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                components={{Toolbar:MembersDataGridTitle}}
              />
              <DataGrid
                sx={{minWidth:500,
                  minHeight:500,
                  gridArea:'bugs',
                  }}
                rows={project.bugs}
                columns={bugColumns}
                getRowId={(row)=>row._id}
                pageSize={6}
                rowsPerPageOptions={[6]}
                experimentalFeatures={{ newEditingApi: true }}
                //onRowClick={handleRowClick}
                components={{Toolbar:BugsDataGridTitle}}
                //checkboxSelection
                disableSelectionOnClick
              />
            </Box>
          <BugDashboard/>
          </>
            :'No Project Currently Selected'
        }
        </>  
    )
}

export default ProjectDashboard