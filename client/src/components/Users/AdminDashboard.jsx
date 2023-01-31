import React, {useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Box,Button,Typography} from '@mui/material';
import { useSelector ,useDispatch} from 'react-redux'
import CreateProjectModal from '../Projects/CreateProjectModal/CreateProjectModal';
import { useNavigate } from "react-router-dom"
import { removeSelectedBug } from '../../redux/actions/bugActions';
import { removeComments } from '../../redux/actions/commentActions';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ProjectDataGridTitle() {
        return(
            <Box style={{marginLeft:'2%',marginTop:'2%',width: "95%", display: "flex",  justifyContent:'space-between'}}>
                <Typography variant="h6">Projects</Typography>
                <CreateProjectModal/>
            </Box>
        )
    }

const showMembers = (e,members) => {
  console.log(123);
}
const AdminDashboard = () => {
    const projects =useSelector((state)=>state.allProjects.projects)
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const navigateToProject=(e,row)=>{
      dispatch(removeSelectedBug())
      dispatch(removeComments())
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
                // <List >{members.map((member)=>(
                //   <ListItem key={member._id}>
                //     {member.email}
                //   </ListItem>
                // ))}</List>
                <>
                  <Button variant="outlined" onClick={(e) => showMembers(e, members)}>
                    View Members
                  </Button>
                </>
              )
            }
            else{
              return (
                <>-</>
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