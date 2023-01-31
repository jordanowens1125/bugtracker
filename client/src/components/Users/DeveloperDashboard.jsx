import React from 'react'
import {Box,Checkbox,Typography} from '@mui/material';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { selectedBug } from '../../redux/actions/bugActions';
import BugComments from '../Bugs/BugComments/BugComments';
import { selectedProject } from '../../redux/actions/projectActions';
import { setComments } from '../../redux/actions/commentActions';
import api from '../../api';

const checkForAssignedBugs=(user)=>{
  if(user){
    if(user.assignedBugs){
      if(user.assignedBugs.length>0){
        return true
      }
    }
  }
  return false
}

const DeveloperDashboard = () => {
    const currentUser= useSelector((state)=>state.currentUser)
    const allBugs = useSelector((state)=>state.allBugs.bugs)
    //return only bugs that match the user project id
    //const projectBugs= allBugs.filter(bug=>bug.projectID._id==currentUser.project[0]._id)
    const projects = useSelector((state)=>state.allProjects.projects)
    const dispatch = useDispatch()
    const checkIfUserHasAProject=(user,projects)=>{
      if(user){
        if(user.project){
          if(user.project[0]){
            //const userProject = projects.filter((project)=>project._id===user.project[0]._id)
            return true
          }
        }
      }
      return false
    }
    const doesUserHaveAProject=checkIfUserHasAProject(currentUser,projects)

    const handleRowClick=async(e)=>{
      let bug = {...e.row}
      bug.projectID= e.row.projectID._id
      const userProject = projects.filter((project)=>project._id===bug.projectID)
      //this should only return project
      dispatch(selectedProject(userProject[0]))
      dispatch(selectedBug(bug))
      const updatedComments = await api.comments.fetchBugComments(bug._id)      
      dispatch(setComments(updatedComments))
    }
    const bugColumns = [
      { field: 'assigned', headerName: 'Assigned', width: 90 ,
      renderCell:(params)=>{
        const userIsAssigned=()=>{
          if(params.row.assignedTo){
            if(params.row.assignedTo.length>0){
              if(params.row.assignedTo[0]._id===currentUser._id){
                return true
              }
            }
          }
          return false
        }
        return(
        <Checkbox  checked={userIsAssigned()} disabled variant="outlined" ></Checkbox>
        )
      }},
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
  return (
    <>
    {doesUserHaveAProject?
    <>
      <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container sx={{}}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {currentUser.project[0].title}
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
            {currentUser.project[0].description}
            </Typography>
            <Box sx={{ height: 400, 
              width: '98%',display:{xs:'block',sm:'block',md:'block', lg:'flex'}}}
              >
              <>
                <DataGrid
                  rows={allBugs}
                  getRowId={(row)=>row._id}
                  columns={bugColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  onRowClick={handleRowClick}
                  experimentalFeatures={{ newEditingApi: true }}
                  // components={{Toolbar:ProjectDataGridTitle}}
                />
              </>
            </Box>
            <BugComments/>
          </Container>
        </Box>
    </>
    :
    <><Box>
        <Typography
              component="h1"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              No project currently assigned!
              Request to be added to a project
            </Typography>
      </Box></>
    }
              
    </>
  )
}

export default DeveloperDashboard