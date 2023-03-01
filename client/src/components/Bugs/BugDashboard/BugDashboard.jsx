import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import BugComments from "../BugComments/BugComments";
import {
  removeSelectedBug,
  selectedBug,
  setBugs,
} from "../../../redux/actions/bugActions";
import { Button, Typography } from "@mui/material";
import EditBugModal from "../EditBugModal/EditBugModal";
import { removeComments } from "../../../redux/actions/commentActions";
import api from "../../../api/index";
import { selectedUser, setUsers } from "../../../redux/actions/userActions";
import { setMessage } from "../../../redux/actions/messageActions";
import { selectedProject } from "../../../redux/actions/projectActions";

const checkBug = (bug) => {
  if (bug._id) {
    if (bug.assignedTo) {
      return true;
    }
  } else {
    return false;
  }
};

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

const checkIfUserCanWorkOnBug = (bug) => {
  //for now only one person can be assigned to a bug at a time
  if (bug) {
    if (bug.assignedTo) {
      if (bug.assignedTo.length === 0) {
        return true;
      }
    }
  }
  return false;
};

const checkIfUserIsAssignedToBug = (bug, user) => {
  //make sure we have bug
  if (bug) {
    //make sure we have user
    if (user) {
      //sometimes it takes a moment for the assignedTo to populate
      if (bug.assignedTo) {
        for (let i = 0; i < bug.assignedTo.length; i++) {
          if (bug.assignedTo[i]._id === user._id) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const BugDashboard = () => {
  const bug = useSelector((state) => state.currentBug);
  const isBugFilled = checkBug(bug);
  const dispatch = useDispatch();
  const clearCurrentBug = () => {
    dispatch(removeSelectedBug());
    dispatch(removeComments());
  };
  const user = useSelector((state) => state.currentUser);
  const project = useSelector((state) => state.project);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  //if on project and not assigned to bug  and bug assigned to is empty then user can join
  const [userCanEdit, setUserCanEdit] = useState(false);
  //if assigned to bug or admin then they can edit
  const [userCanJoin, setUserCanJoin] = useState(false);

  const handleJoinBugRequest = async () => {
    const updatedUser = await api.users.assignBugToUser(user._id, bug._id);
    const updatedBug = await api.bugs.fetchBug(bug._id);
    const updatedUsers = await api.users.fetchUsers();
    const updatedProject = await api.projects.fetchProject(bug.projectID);
    const updatedBugs = await api.bugs.fetchBugs();
    dispatch(selectedUser(updatedUser));
    dispatch(selectedBug(updatedBug));
    dispatch(setUsers(updatedUsers));
    dispatch(selectedProject(updatedProject.project));
    dispatch(setBugs(updatedBugs));
    dispatch(setMessage(`You have been assigned to bug ${updatedBug.title}`));
  };

  const handleLeaveBugRequest = async () => {
    const updatedUser = await api.users.unAssignBugFromUser(user._id, bug._id);
    const updatedBug = await api.bugs.fetchBug(bug._id);
    const updatedUsers = await api.users.fetchUsers();
    // const updatedProject = await api.projects.fetchProject(bug.projectID);
    const updatedBugs = await api.bugs.fetchBugs();
    dispatch(selectedUser(updatedUser));
    dispatch(selectedBug(updatedBug));
    dispatch(setUsers(updatedUsers));
    dispatch(setBugs(updatedBugs));
    dispatch(
      setMessage(`You have been unassigned from bug ${updatedBug.title}`)
    );
  };

  useEffect(() => {
    //is user admin?
    if (user.role === "Admin") {
      setUserIsAdmin(true);
    } else {
      setUserIsAdmin(false);
    }
    //can user join
    if (
      checkIfUserIsAssignedToProject(user, project) &&
      checkIfUserCanWorkOnBug(bug, user)
    ) {
      //check if user is on project and if bug is not assigned to anyone
      //make sure this is not an admin
      if (user.role !== "Admin") {
        setUserCanJoin(true);
      }
    } else {
      setUserCanJoin(false);
    }
    //can user edit
    if (userIsAdmin || checkIfUserIsAssignedToBug(bug, user)) {
      setUserCanEdit(true);
    } else {
      setUserCanEdit(false);
    }
  }, [bug, user, project, userIsAdmin]);
  return (
    <>
      <Box
        sx={{
          minWidth: 500,
          marginTop: { xs: "7%", sm: "7%", md: "7%", lg: "1%" },
          width: "96%",
          display: "flex",
          flexDirection: "column",
          gridTemplateAreas: {
            xs: `"info"
                    "bug"
                    "comments"
                    `,
            sm: `
                    "info"
                    "bug"
                    "comments"
                    `,
            md: `
                    "info info"
                    "bug comments"
                    "bug comments"
                  `,
          },
          gap: 3,
          padding: "2%",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            gridArea: "info",
            height: 50,
            padding: "3%",
            width: { xs: "86%", sm: "94%" },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: { xs: "7%", sm: "5%", md: "2%", lg: "0%" },
          }}
        >
          <Typography>Selected Bug Info</Typography>
          {isBugFilled ? (
            <>
              <Button
                aria-label="Clear Bug Info"
                variant="contained"
                onClick={clearCurrentBug}
              >
                Clear Bug
              </Button>
            </>
          ) : (
            <></>
          )}
        </Paper>
        {isBugFilled ? (
          <>
            <Paper
              elevation={1}
              sx={{
                width: { xs: "86%", sm: "94%" },
                gridArea: "bug",
                padding: "2%",
              }}
            >
              {userCanEdit ? (
                <>
                  <EditBugModal />
                  {userIsAdmin ? (
                    <></>
                  ) : (
                    <>
                      <Button
                        aria-label="Unassign yourself from this bug"
                        onClick={handleLeaveBugRequest}
                      >
                        Unassign self from bug
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
              {userCanJoin ? (
                <>
                  <Button
                    onClick={handleJoinBugRequest}
                    aria-label="Add yourself to this bug"
                  >
                    Join
                  </Button>
                </>
              ) : (
                <></>
              )}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 2,
                  gridTemplateRows: "repeat(3, 1fr)",
                  gridTemplateAreas: `
                                "title    status    .       description description"
                                "creator  priority  type    description description"
                                "assigned assigned assigned assigned assigned"`,
                }}
              >
                <Box
                  sx={{
                    gridArea: "title",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Title
                  </Typography>
                  <Typography variant="button" gutterBottom>
                    {bug.title}
                  </Typography>
                </Box>
                {/* <Box sx={{ gridArea: "creator" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Creator
                  </Typography>
                  <Typography variant="button" gutterBottom>
                    {bug.creator}
                  </Typography>
                </Box> */}
                <Box
                  sx={{
                    gridArea: "description",
                    overflow: "visible",
                    wordBreak: "break-all",
                    height: "auto",
                    justifyContent: "start",
                    whiteSpace: "initial",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom noWrap>
                    Description
                  </Typography>
                  <Typography variant="button" gutterBottom>
                    {bug.description}
                  </Typography>
                </Box>
                <Box sx={{ gridArea: "status" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Status
                  </Typography>
                  <Typography variant="button" gutterBottom>
                    {bug.status}
                  </Typography>
                </Box>
                <Box sx={{ gridArea: "priority" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Priority
                  </Typography>
                  <Typography variant="button" gutterBottom>
                    {bug.priority}
                  </Typography>
                </Box>
                {/* <Box sx={{ gridArea: 'type',  }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Type
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {bug.type}
                                </Typography>
                            </Box> */}
                <Box sx={{ gridArea: "assigned" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Assigned Devs
                  </Typography>
                  <div>
                    {bug.assignedTo.map((member) => (
                      // button that allows for unassign current member from bug if they are assigned to it
                      <div key={member}>{member.email}</div>
                    ))}
                  </div>
                </Box>
              </Box>
            </Paper>
            <BugComments />
          </>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

export default BugDashboard;
