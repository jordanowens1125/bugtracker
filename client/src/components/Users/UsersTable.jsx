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
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Assigned Project</TableCell>
                <TableCell align="center">Assigned Bugs</TableCell>
                <TableCell align="center">Comments</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={[user._id, user.email]}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* <TableCell component="th" scope="row">{user.uid} </TableCell> */}
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.role}</TableCell>
                  <TableCell align="center">{user.projectDisplay}</TableCell>
                  <TableCell align="center">
                    {user.assignedBugs.length}
                  </TableCell>
                  <TableCell align="center">{user.comments.length}</TableCell>
                  <TableCell align="center">
                    <Link to={`${user._id}`}>
                      <Button variant="contained">View</Button>
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
