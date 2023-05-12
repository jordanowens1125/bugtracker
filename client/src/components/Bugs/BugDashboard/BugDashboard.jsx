import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {  useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import BugComments from "../BugComments/BugComments";
import { Typography } from "@mui/material";
import EditBugModal from "../EditBugModal/EditBugModal";

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
  const user = useSelector((state) => state.currentUser);
  const project = useSelector((state) => state.project);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  //if on project and not assigned to bug  and bug assigned to is empty then user can join
  const [userCanEdit, setUserCanEdit] = useState(false);
  //if assigned to bug or admin then they can edit

  useEffect(() => {
    //is user admin?
    if (user.role === "Admin") {
      setUserIsAdmin(true);
    } else {
      setUserIsAdmin(false);
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
          
        </Paper>
        
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
                      
                    </>
                  )}
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
                    Assigned Dev
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
      </Box>
    </>
  );
};

export default BugDashboard;
