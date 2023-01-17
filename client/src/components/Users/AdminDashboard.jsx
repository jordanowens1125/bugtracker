import React from 'react'
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import { DataGrid } from '@mui/x-data-grid';
import {Box,Button,Paper,Typography} from '@mui/material';
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import ProjectDashboard from '../ProjectDashboard/ProjectDashboard';
import { selectedProject } from '../../redux/actions/projectActions';
import { useDispatch } from 'react-redux';
import CreateProjectModal from '../Projects/CreateProjectModal/CreateProjectModal';
import api from '../../api';
import { Link, useNavigate } from "react-router-dom"
import { removeSelectedBug } from '../../redux/actions/bugActions';

function ProjectDataGridTitle() {
        return(
            <Box style={{marginLeft:'2%',marginTop:'2%',width: "95%", display: "flex",  justifyContent:'space-between'}}>
                <Typography variant="h6">Projects</Typography>
                <CreateProjectModal/>
            </Box>
        )
    }
const AdminDashboard = () => {
    
    const projects =useSelector((state)=>state.allProjects.projects)
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const navigateToProject=(e,row)=>{
      dispatch(removeSelectedBug())
      navigate(`/projects/${row._id}`)
    }
    const columns = [
        {
          field:'title',
          headerName: 'Title',
          width: 150,
          headerAlign: 'center',
          align:'center',
          renderCell:(params)=>{
            return(<Button key={params.id} onClick={(e)=>navigateToProject(e,params.row)}>{params.row.title}</Button>
            )
          }
        }, 
          {
            field: 'description',
            headerName: 'Description',
            width: 450,
            headerAlign: 'center',
            align:'center',
            editable: true,
        },
        {
          field: 'Contributors',
          headerName: 'Contributors',
          width: 350,
          headerAlign: 'center',
          align:'center',
          renderCell:(params)=>{
            const members =(params.row.members)
            if(members.length>0){
              return(
                <List >{members.map((member)=>(
                  <ListItem key={member._id}>
                    {member.email}
                  </ListItem>
                ))}</List>
              )
            }
            else{
              return (
                <List>
                  <ListItem>-</ListItem>
                </List>
              )
            }
          }
        },
      ];
  return (<>
    <Box sx={{ height: 400, width: '100%',paddingBottom:10, }}>
                <DataGrid
                    rows={projects}
                    getRowId={(row)=>row._id}
                    columns={columns}
                    pageSize={5}
                    getEstimatedRowHeight={() => 200}
                    rowsPerPageOptions={[5]}
                    //onRowClick={navigateToProject}
                    experimentalFeatures={{ newEditingApi: true }}
                    components={{Toolbar:ProjectDataGridTitle}}
                />
            </Box>
            <Box>
                {/* Bug Info */}
            </Box>
  </> 
  )
}

export default AdminDashboard