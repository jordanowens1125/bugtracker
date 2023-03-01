import React from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { removeSelectedBug, selectedBug } from "../../redux/actions/bugActions";
import { selectedProject } from "../../redux/actions/projectActions";
import {
  removeComments,
  setComments,
} from "../../redux/actions/commentActions";
import api from "../../api";
import { useNavigate } from "react-router";
import Unassigned from "./Unassigned";

function BugDataGridTitle() {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography fontSize={30}>Bugs</Typography>
      <div></div>
    </Box>
  );
}

const DeveloperDashboard = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const allBugs = useSelector((state) => state.allBugs.bugs);

  //return only bugs that match the user project id
  //const projectBugs= allBugs.filter(bug=>bug.projectID._id==currentUser.project[0]._id)
  const projects = useSelector((state) => state.allProjects.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkIfUserHasAProject = (user) => {
    if (user) {
      if (user.project) {
        if (user.project[0]) {
          //const userProject = projects.filter((project)=>project._id===user.project[0]._id)
          return true;
        }
      }
    }
    return false;
  };
  const getProjectBugs = (allBugs) => {
    const bugs = [];
    if (allBugs && currentUser.project[0]) {
      for (let i = 0; i < allBugs.length; i++) {
        if (allBugs[i].projectID) {
          if (allBugs[i].projectID === currentUser.project[0]._id) {
            bugs.push(allBugs[i]);
          }
        }
      }
    }
    return bugs;
  };
  const doesUserHaveAProject = checkIfUserHasAProject(currentUser);
  const projectBugs = getProjectBugs(allBugs);
  const sendToProjectPage = () => {
    const projectID = currentUser.project[0]._id;
    dispatch(removeSelectedBug());
    dispatch(removeComments());
    navigate(`/projects/${projectID}`);
  };

  const sendToBug = async (bugID) => {
    const bug = await api.bugs.fetchBug(bugID);
    const projectID = currentUser.project[0]._id;
    navigate(`/projects/${projectID}`);
    dispatch(selectedBug(bug));
    const updatedComments = await api.comments.fetchBugComments(bug._id);
    dispatch(setComments(updatedComments));
  };
  const handleRowClick = async (e) => {
    let bug = { ...e.row };
    bug.projectID = e.row.projectID._id;
    const userProject = projects.filter(
      (project) => project._id === bug.projectID
    );
    //this should only return project
    dispatch(selectedProject(userProject[0]));
    dispatch(selectedBug(bug));
    const updatedComments = await api.comments.fetchBugComments(bug._id);
    dispatch(setComments(updatedComments));
  };
  const bugColumns = [
    {
      field: "assigned",
      headerName: "Assigned",
      width: 90,
      renderCell: (params) => {
        const userIsAssigned = () => {
          if (params.row.assignedTo) {
            if (params.row.assignedTo.length > 0) {
              if (params.row.assignedTo[0]._id === currentUser._id) {
                return true;
              }
            }
          }
          return false;
        };
        return (
          <Checkbox
            checked={userIsAssigned()}
            disabled
            variant="outlined"
          ></Checkbox>
        );
      },
    },
    // { field: '_id', headerName: 'ID', width: 90 },
    {
      field: "visit",
      headerName: "Visit",
      width: 75,
      align:'center',
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={(e) => sendToBug(params.row._id)}
              aria-label="Visit this bug"
              align='left'
            >
              View
            </Button>
          </>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      description: "This column has a value getter and is not sortable.",
      width: 250,
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      editable: true,
    },
    {
      field: "openDate",
      headerName: "Open Date",
      width: 100,
      editable: true,
    },
    {
      field: "closeDate",
      headerName: "Close Date",
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
      {doesUserHaveAProject ? (
        <>
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container
              sx={{
                display: "flex",
                alignContent: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center'
              }}
            >
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                {currentUser.project[0].title}
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                {currentUser.project[0].description}
              </Typography>
              <Button
                onClick={(e) => sendToProjectPage(e)}
                aria-label="Go to project page"
              >
                Go to project page
              </Button>
              <Box
                sx={{
                  height: 600,
                  display: 'flex',
                  width: { xs: 400, sm: 950 },
                }}
              ><>
                  <DataGrid
                    rows={projectBugs}
                    getRowId={(row) => row._id}
                    columns={bugColumns}
                    pageSize={8}
                    rowsPerPageOptions={[8]}
                    onRowClick={handleRowClick}
                    experimentalFeatures={{ newEditingApi: true }}
                    components={{ Toolbar: BugDataGridTitle }}
                  />
                </>
              </Box>
            </Container>
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              No project currently assigned! Feel free to join a public project
              below until another is assigned.
              <Unassigned />
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default DeveloperDashboard;
