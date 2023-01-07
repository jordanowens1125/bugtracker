import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import dayjs from 'dayjs'
import ProjectDashboard from '../ProjectDashboard/ProjectDashboard';
import { selectedProject } from '../../redux/actions/projectActions';
import { useDispatch } from 'react-redux';
import api from '../../api';
const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      valueGetter:(params)=>`${dayjs(params.row.startDate).format('MM/DD/YYYY')}`
    },
    {
        field: 'deadline',
        headerName: 'Deadline',
        width: 150,
        valueGetter:(params)=>`${dayjs(params.row.deadline).format('MM/DD/YYYY')}`
    }, 
    {
        field: 'Bug Count',
        headerName: 'Bug Count',
        description: 'This column has a value getter and is not sortable.',
        width: 150,
        valueGetter: (params) =>
          `${params.row.bugs.length}`,
    },
    {
        field: 'Member Count',
        headerName: 'Member Count',
        description: 'This column has a value getter and is not sortable.',
        width: 150,
        valueGetter: (params) =>
          `${params.row.members.length}`,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 150,
        editable: true,
    },
  ];

  
const UserDashboard = () => {
    const user = useSelector((state)=>state.currentUser)
    const projects =useSelector((state)=>state.allProjects.projects)
    const isUserAnAdmin = user.role=='admin'
    const isUserADeveloper=user.role=='developer'
    const isUserAViewer=user.role=='viewer'
    const dispatch=useDispatch()

    const handleRowClick=async(e)=>{
        const fetchedProject =await api.projects.fetchProject(e.row._id)
        dispatch(selectedProject(fetchedProject))
  }
    useEffect(()=>{

    },[user])
  return (
    <>{isUserAnAdmin? 
        <>
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={projects}
                getRowId={(row)=>row._id}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={handleRowClick}
                experimentalFeatures={{ newEditingApi: true }}
            />
            
        </Box>
        <Box><div>Selected Project Info</div><ProjectDashboard/></Box>
        </>        
        :<></>
        }
    </>
  )
}

export default UserDashboard