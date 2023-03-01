import React, { useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { setUsers } from "../../redux/actions/userActions";
// import { setProjects } from "../../redux/actions/projectActions";
// import api from "../../api/index";

const UsersTable = () => {
  const users = useSelector((state) => state.allUsers.userDisplayList);
  const hasUsers = users.length > 0;

  useEffect(() => {}, [users]);

  return (
    <>
      {hasUsers ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {/* <TableCell>UID </TableCell> */}
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Assigned Project</TableCell>
                <TableCell align="left">Assigned Bugs</TableCell>
                <TableCell align="left">Comments</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={[user._id, user.email]}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* <TableCell component="th" scope="row">{user.uid} </TableCell> */}
                  <TableCell align="left">{user.name}</TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="left">{user.role}</TableCell>
                  <TableCell align="left">{user.projectDisplay}</TableCell>
                  <TableCell align="left">{user.assignedBugs.length}</TableCell>
                  <TableCell align="left">{user.comments.length}</TableCell>
                  <TableCell align="left">
                    <Link to={`${user._id}`}>
                      <Button
                        variant="contained"
                        aria-label="Go view this user's info"
                      >
                        View
                      </Button>
                    </Link>
                  </TableCell>
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

export default UsersTable;
