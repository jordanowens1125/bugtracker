import React, { useMemo,useEffect,useState } from 'react'
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux'
import './ProjectDashboard.css'
import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import {selectedBug} from '../../redux/actions/bugActions'
const memberColumns = [
    { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
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
          return(<button onClick={(e)=>removeUser(e,params.row)}>
            Delete
          </button>)
        }
      }
  ];

  const removeUser=(e,row)=>{
    console.log(row)
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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

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
    const users =useSelector((state)=>state.allUsers.users)
    const bugs = useSelector((state)=>state.allBugs.bugs)
    const dispatch=useDispatch()
    const [selectedUsers,setSelectedUsers]=useState([])
    useEffect(() => {
    },[project]);
    
    const handleRowClick=(e)=>{
        const foundBug = findMatchingBug(e.id,bugs)
        dispatch(selectedBug(foundBug))
    }
    return (
        <>{isCurrentProjectFilled ?
            <Box className='project-dashboard' sx={{ height: 400, 
            width: '100%',display: 'flex',paddingTop:'80px',}}>
            <DataGrid
              sx={{width:'50%'}}
              rows={project.members}
              columns={memberColumns}
              onSelectionModelChange={(ids)=>{
                setSelectedUsers(ids)
              }}
              getRowId={(row)=>row._id}
              pageSize={6}
              rowsPerPageOptions={[6]}
              checkboxSelection
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
            <DataGrid
              sx={{width:'50%'}}
              rows={project.bugs}
              columns={bugColumns}
              getRowId={(row)=>row._id}
              pageSize={6}
              rowsPerPageOptions={[6]}
              //checkboxSelection
              //disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              onRowClick={handleRowClick}
            />
          </Box>
            :'Loading'
        }
        </>  
    )
}

export default ProjectDashboard