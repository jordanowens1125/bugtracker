import React, { useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ProjectDashboard.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../../api/index";
import { selectedBug, setBugs } from "../../../redux/actions/bugActions";
import { setComments } from "../../../redux/actions/commentActions";
import {
  selectedProject,
  setProjects,
} from "../../../redux/actions/projectActions";
import { setUsers } from "../../../redux/actions/userActions";
import CreateBugModal from "../../Bugs/CreateBugModal/CreateBugModal";
import BugDashboard from "../../Bugs/BugDashboard/BugDashboard";
import { setMessage } from "../../../redux/actions/messageActions";
import Loading from '../../Loading'

const style =
{
   height: 600,
              display: "grid",
              minWidth: 500,
              gridTemplateAreas: {
                lg: `"users bugs"`,
                md: `
                "users" 
                "bugs"
              `,
                sm: `
                "users"
                "bugs"
                `,
                xs: `"users"
                "bugs"`,
              },
              gap: 5,
              padding: "2%",
              width: "96%",
}

const checkIfUserIsAssignedToProject = (user, project) => {
  if (user) {
    if (user.project) {
      if (user.project[0]) {
        if (user.project[0]._id === project._id) {
          return true;
        }
      }
    }
  }
  return false;
};

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
      <div></div>
    </Box>
  );
}

function checkProject(project) {
  if (project.bugs) {
    return true;
  } else {
    return false;
  }
}

const findMatchingBug = (bugID, bugs) => {
  for (let i = 0; i < bugs.length; i++) {
    if (bugs[i]._id === bugID) {
      return bugs[i];
    }
  }
};

const ProjectDashboard = () => {
  const user = useSelector((state) => state.currentUser);
  const userIsAdmin = user.role === 'Admin';
  
  const project = useSelector((state) => state.project);
  const userIsAssignedToProject = checkIfUserIsAssignedToProject(
    user,
    project
  );
  const isCurrentProjectFilled = checkProject(project);
  const bugs = useSelector((state) => state.allBugs.bugs);
  const currentBug = useSelector((state) => state.currentBug);
  const canEditBugs = userIsAdmin || userIsAssignedToProject;
  const dispatch = useDispatch();
  useEffect(() => {}, [project, userIsAdmin, userIsAssignedToProject, user]);
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
        <Typography variant="h5"> Select A Bug Below</Typography>
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
  const removeUser = async (e, row) => {
    await api.users.unAssignUserFromProject(row._id, project._id);
    const updatedUsers = await api.users.fetchUsers();
    const updatedProjects = await api.projects.fetchProjects();

    const updatedProject = await api.projects.fetchProject(project._id);
    const updatedBugs = await api.bugs.fetchBugs();
    if (currentBug.assignedTo) {
      const updatedBug = await api.bugs.fetchBug(currentBug._id);
      dispatch(selectedBug(updatedBug));
      const updatedComments = await api.comments.fetchBugComments(
        currentBug._id
      );
      dispatch(setComments(updatedComments));
    }
    dispatch(setBugs(updatedBugs));
    dispatch(setUsers(updatedUsers));
    dispatch(setProjects(updatedProjects));
    //backend brings back both projects and available members so we must specify the project object
    dispatch(selectedProject(updatedProject.project));
    dispatch(setMessage(`User was successfully removed from ${project.title}`));
  };

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
      field: "name",
      headerName: "Name",
      width: 250,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      editable: true,
    },
    {
      field: "Remove User",
      width: 125,
      renderCell: (params) => {
        return (
          <>
            {userIsAdmin ? (
              <>
                <Button
                  aria-label="Remove user from project"
                  onClick={(e) => removeUser(e, params.row)}
                  variant="outlined"
                  color="error"
                >
                  Remove
                </Button>
              </>
            ) : (
              <>-</>
            )}
          </>
        );
      },
    },
  ];
  const handleRowClick = async (e, row) => {
    //console.log(row)
    const foundBug = findMatchingBug(row._id, bugs);
    dispatch(selectedBug(foundBug));
    const updatedComments = await api.comments.fetchBugComments(foundBug._id);
    dispatch(setComments(updatedComments));
  };
  const bugColumns = [
    {
      field: "title",
      headerName: "Title",
      width: 350,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Button
            aria-label="Populate this bug below"
            variant="outlined"
            key={params.id}
            onClick={(e) => handleRowClick(e, params.row)}
          >
            {params.row.title}
          </Button>
        );
      },
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
  ];
  return (
    <>
      {isCurrentProjectFilled ? (
        <>
          <Box sx={style}>
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
              //onRowClick={handleRowClick}
              components={{ Toolbar: BugsDataGridTitle }}
              //checkboxSelection
              disableSelectionOnClick
            />
          </Box>
          <BugDashboard />
        </>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
};

export default ProjectDashboard;
