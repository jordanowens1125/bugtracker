import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import CreateBugModal from "../../Bugs/CreateBugModal/CreateBugModal";
import Loading from "../../Loading";
import { useNavigate } from "react-router-dom";

const style = {
  height: 600,
  display: "flex",
  minWidth: "100%",
  flexDirection: 'column',
  p: 4,
  gap: 5,
  alignItems:'center'
};

const checkIfUserIsAssignedToProject = (user, project) => {
  if (user) {
    if (user.project) {
      if (user.project) {
        if (user.project._id === project._id) {
          return true;
        }
      }
    }
  }
  return false;
};

function checkProject(project) {
  if (project.bugs) {
    return true;
  } else {
    return false;
  }
}

const ProjectDashboard = () => {
  const user = useSelector((state) => state.currentUser);
  const userIsAdmin = user.role === "Admin";
  const project = useSelector((state) => state.project);
  const userIsAssignedToProject = checkIfUserIsAssignedToProject(user, project);
  const isCurrentProjectFilled = checkProject(project);
  const canEditBugs = userIsAdmin || userIsAssignedToProject;
  const navigate = useNavigate();
  useEffect(() => { }, [project, userIsAdmin, userIsAssignedToProject, user]);
  
  const navigateToManageUsers = () => {
    navigate(`/projects/${project._id}/managemembers`);
  }

  const navigateToBug = (e,row) => {
    navigate(`/bugs/${row._id}`)
  }

  function BugsDataGridTitle() {
    return (
      <Box
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5"> Project Bugs</Typography>

        {canEditBugs ? (
          <>
            <CreateBugModal />
          </>
        ) : (
          <></>
        )}
      </Box>
    );
  }

  function MembersDataGridTitle() {
    return (
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Project Users</Typography>
      </Box>
    );
  }

  const memberColumns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
    },
  ];
  
  const bugColumns = [
    {
      field: "title",
      headerName: "Title",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      editable: true,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      editable: true,
    },
    {
      field: "-",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Button
            aria-label="Go to bug page"
            variant="outlined"
            key={params.id}
            onClick={(e) => navigateToBug(e, params.row)}
          >
            View
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <span>Back to Projects</span>
      {isCurrentProjectFilled ? (
        <>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <Box sx={style}>
            <Button onClick={navigateToManageUsers}>Manage Members</Button>
            <DataGrid
              sx={{ minWidth: 500, minHeight: 250, gridArea: "users" }}
              rows={project.members}
              columns={memberColumns}
              getRowId={(row) => row._id}
              pageSize={2}
              rowsPerPageOptions={[2]}
              //disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              components={{ Toolbar: MembersDataGridTitle }}
            />
            <DataGrid
              sx={{ minWidth: 500, minHeight: 375, gridArea: "bugs" }}
              rows={project.bugs}
              columns={bugColumns}
              getRowId={(row) => row._id}
              pageSize={6}
              rowsPerPageOptions={[6]}
              experimentalFeatures={{ newEditingApi: true }}
              components={{ Toolbar: BugsDataGridTitle }}
              //checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        </>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
};

export default ProjectDashboard;
