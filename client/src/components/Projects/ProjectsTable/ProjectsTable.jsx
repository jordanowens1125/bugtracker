import React from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { setProjects } from "../../../redux/actions/projectActions";
import { removeSelectedBug, setBugs } from "../../../redux/actions/bugActions";
import { setUsers } from "../../../redux/actions/userActions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/index";
import dayjs from "dayjs";
import { removeComments } from "../../../redux/actions/commentActions";
import { setMessage } from "../../../redux/actions/messageActions";

const ProjectsTable = () => {
  const projects = useSelector((state) => state.allProjects.projects);
  const currentUser = useSelector((state) => state.currentUser);
  const hasProjects = projects.length > 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {}, [projects]);
  const navigateToProject = (projectID) => {
    dispatch(removeSelectedBug());
    dispatch(removeComments());
    navigate(`/projects/${projectID}`);
  };

  const handleDeleteClick = async (e) => {
    let projectID = e.currentTarget.dataset.key;
    //make modal popup
    let projectToDelete = "";
    for (let i = 0; i < projects.length; i++) {
      if (projects[i]._id === projectID) {
        projectToDelete = projects[i];
      }
    }
    await api.projects.deleteProject(projectToDelete);
    //refresh projects
    const updatedProjects = await api.projects.fetchProjects();
    dispatch(setProjects(updatedProjects));
    //refresh bugs
    const updatedBugs = await api.bugs.fetchBugs();
    dispatch(setBugs(updatedBugs));
    const updatedUsers = await api.users.fetchUsers();
    dispatch(setUsers(updatedUsers));
    dispatch(setMessage(`Project was successfully deleted!`));
  };

  const handleEditClick = (e) => {
    let projectID = e.currentTarget.dataset.key;
    navigateToProject(projectID);
  };

  return (
    <>
      {hasProjects ? (
        <TableContainer component={Paper}>
          <Table sx={{  }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title </TableCell>
                <TableCell align="left">Start Date</TableCell>
                <TableCell align="left">Deadline</TableCell>
                <TableCell align="left">Member Count</TableCell>
                <TableCell align="left">Bug Count</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{project.title}</TableCell>
                  <TableCell align="left">
                    {dayjs(project.startDate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(project.deadline).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="left">{project.members.length}</TableCell>
                  <TableCell align="left">{project.bugs.length}</TableCell>
                  <TableCell align="left">
                    <Button
                      aria-label="Go to the project page of this bug to view it"
                      onClick={(e) => handleEditClick(e)}
                      variant="contained"
                      data-key={project._id}
                    >
                      View
                    </Button>
                  </TableCell>
                  {currentUser.role === "Admin" ? (
                    <>
                      <TableCell align="left">
                        <Button
                          aria-label="Delete this bug"
                          onClick={handleDeleteClick}
                          variant="outlined"
                          color="error"
                          data-key={project._id}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <></>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "No projects"
      )}
    </>
  );
};

export default ProjectsTable;
