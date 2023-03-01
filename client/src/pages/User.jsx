import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/index";
import { selectedUser,setUsers } from "../redux/actions/userActions";
import Button from "@mui/material/Button";
import TextField  from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { setMessage } from "../redux/actions/messageActions";

const roles = ['Viewer', 'Developer', 'Admin']

const User = () => {
  const userID = useParams().id;
  const dispatch = useDispatch();

  //info regarding user who is currently logged in
  const currentUser = useSelector((state) => state.currentUser);
  //if either is true we an edit
  const userCanEdit =
    currentUser._id === userID || currentUser.role === "Admin";

  const userIsAdmin = currentUser.role === "Admin";

  // line below pertains to user page info
  const [user, setUser] = useState("");
  
  const [formInputData, setFormInputData] = useState({
    id: '',
    email: '',
    photoURL: '',
    role: '',
    name: '',
  });

  const fetchUserDetails = async () => {
    const fetchedUser = await api.users.fetchUser(userID);
    //return  User
    setUser(fetchedUser);
    setFormInputData(fetchedUser)
    //if ids match then update user in case an update occurs
    if (currentUser._id === userID) {
      dispatch(selectedUser(fetchedUser));
    }
  };

  //function to submit update request
  const handleSubmit = async (e) => {
    
    e.preventDefault()
    const updatedUserInfo = {}
    updatedUserInfo['role'] = formInputData.role
    updatedUserInfo['name'] = formInputData.name
    updatedUserInfo['photoURL'] = formInputData.photoURL
    updatedUserInfo['id'] = userID
    const updatedUser = await api.users.updateUser(updatedUserInfo);
    //if this is the current user who is logged in then update the current user
    if (updatedUser.id === userID) {
      dispatch(selectedUser(updatedUser))
    }
    const users = await api.users.fetchUsers()
    dispatch(setUsers(users))
    if (user.role === 'Admin') {
      dispatch(
        setMessage(`${updatedUser.name} has been updated`)
      );
    }
    else {
      dispatch(setMessage(`User has been updated`));
    }
  };

  const handleChange = (e) => {
    const inputProp = e.target.name || e.target.id
    const newInputValue = { ...formInputData }
    newInputValue[inputProp] = e.target.value;
    setFormInputData(newInputValue)
  }

  useEffect(() => {
    if (userID && userID !== "") {
      fetchUserDetails();
      return () => {};
    }
  }, [userID]);

  return (
    <>
      {/* User info */}
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <FormControl>
          <TextField
            id="name"
            variant="filled"
            label="Name"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={formInputData.name || ""}
            disabled={!userCanEdit}
            required
          />
        </FormControl>

        <FormControl sx={{ m: 1, width: 300 }} onSubmit={handleSubmit}>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            id="role"
            name="role"
            value={formInputData.role}
            label="Role"
            onChange={handleChange}
            disabled={!userIsAdmin}
          >
            <MenuItem value=""></MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* 
          Change Photo Url
        */}
        {userCanEdit ? (
          <>
            <Button variant="contained" onClick={handleSubmit} aria-label="Update Account">
              Update Account
            </Button>
          </>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

export default User;
