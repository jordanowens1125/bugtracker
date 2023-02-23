import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import api from '../../api/index'
import {selectedUser} from '../../redux/actions/userActions'
import { setProjects } from '../../redux/actions/projectActions';

const Unassigned = () => {
    const currentUser = useSelector(state => state.currentUser)
    const projects = useSelector(state => state.allProjects.projects)
    const publicProjects = [...projects].filter(project => project.public === true)
    const dispatch = useDispatch()

    
    const handleProjectJoin = async(e, project) => {
        //api call to add user to project
        const updatedUser = await api.users.addUserToProject(currentUser._id, project._id)
        //update user in redux
        dispatch(selectedUser(updatedUser))
        //update projects
        const updatedProjects = await api.projects.fetchProjects()
        dispatch(setProjects(updatedProjects))
        window.location.reload();
    };

    const columns = [
      {
        field: "Join",
        headerName: "",
        width: 100,
        renderCell: (params) => {
          return (
            <Button
              key={params.id}
              onClick={(e) => handleProjectJoin(e, params.row)}
            >
              Join
            </Button>
          );
        },
      },
      {
        field: "title",
        headerName: "Title",
        width: 250,
      },
      {
        field: "description",
        headerName: "Description",
        width: 350,
      },
      {
        field: "Members",
        headerName: "Member Count",
        sortable: true,
        width: 160,
        valueGetter: (params) => `${params.row.members.length}`,
      },
      {
        field: "Bugs",
        headerName: "Bug Count",
        sortable: true,
        width: 160,
        valueGetter: (params) => `${params.row.bugs.length}`,
      },
    ];

    return (
      <>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={publicProjects}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </>
    );
}

export default Unassigned