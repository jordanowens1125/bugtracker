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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/index";
import { setBugs, selectedBug } from "../../../redux/actions/bugActions";
import { setComments } from "../../../redux/actions/commentActions";
import {
  selectedProject,
  setProjects,
} from "../../../redux/actions/projectActions";
import dayjs from "dayjs";
import { setMessage } from "../../../redux/actions/messageActions";

const BugsTable = () => {
  const bugs = useSelector((state) => state.allBugs.bugs);
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasBugs = bugs.length > 0;
  //if there are no projects then there should not be any bugs
  useEffect(() => {}, [bugs]);

  const handleEditClick = async (e) => {
    let bugID = e.currentTarget.dataset.key;
    const bug = await api.bugs.fetchBug(bugID);
    const project = await api.projects.fetchProject(bug.projectID);
    dispatch(selectedBug(bug));
    const updatedComments = await api.comments.fetchBugComments(bug._id);
    dispatch(setComments(updatedComments));
    dispatch(selectedProject(project));
    navigate(`/projects/${bug.projectID}`);
  };

  const handleDeleteClick = async (e) => {
    let [bugID, projectID] = e.currentTarget.dataset.key.split(",");
    await api.bugs.deleteBug(bugID, projectID);
    //make modal popup
    //update bugs for redux
    const updatedProjects = await api.bugs.fetchBugs();
    dispatch(setBugs(updatedProjects));
    //update projects for redux
    const newProjects = await api.projects.fetchProjects();
    dispatch(setProjects(newProjects));
    dispatch(setMessage(`Bug was successfully deleted!`));
  };

  return (
    <>
      {hasBugs ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Bug(Title) </TableCell>
                <TableCell align="left">Open Date</TableCell>
                <TableCell align="left">Priority</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bugs.map((bug) => (
                <TableRow
                  key={bug._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{bug.title}</TableCell>
                  <TableCell align="left">
                    {dayjs(bug.openDate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="left">{bug.priority}</TableCell>
                  <TableCell align="left">{bug.status}</TableCell>
                  <TableCell align="left">
                    <Button
                      data-key={bug._id}
                      variant="contained"
                      onClick={handleEditClick}
                    >
                      View
                    </Button>
                  </TableCell>
                  {user.role === "Admin" ? (
                    <>
                      <TableCell align="left">
                        <Button
                          onClick={handleDeleteClick}
                          variant="contained"
                          color="error"
                          data-key={[bug._id, bug.projectID._id]}
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
        <h1>Loading</h1>
      )}
    </>
  );
};

export default BugsTable;
