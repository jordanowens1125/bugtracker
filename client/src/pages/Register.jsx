import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import api from "../api/index";
import { useUserAuth } from "../context/userAuthContext";
import { selectedUser, setUsers } from "../redux/actions/userActions";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Bug Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const Register = () => {
  const [user, loading] = useAuthState(auth);
  const [formInputData, setFormInputData] = useState({
    email: "",
    password: "",
    uid: "",
  });
  const users = useSelector((state) => state.allUsers.users);
  const dispatch = useDispatch();
  const findUserWithUID = async (user, users) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid === user.uid) {
        dispatch(selectedUser(users[i]));
        return "";
      }
    }
    const newUser = { email: user.email, uid: user.uid };
    const createdUser = await api.users.createUser(newUser);
    dispatch(selectedUser(createdUser));
    const updatedUsers = await api.users.fetchUsers();
    dispatch(setUsers(updatedUsers));
  };
  const { signUp } = useUserAuth();
  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.id || e.target.name; //target name for the bugs select
    //if name is start or deadline change format to string
    const newInputValue = {
      ...formInputData,
      [inputFieldName]: inputFieldValue,
    };
    setFormInputData(newInputValue);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  //sign in with google
  const GoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      findUserWithUID(result.user, users);
      navigate(`/`);
    } catch (error) {
      console.log("err:", error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await signUp(
        formInputData.email,
        formInputData.password
      );
      const newInputValue = { ...formInputData };
      newInputValue.uid = response.user.uid;
      newInputValue.name = response.user.displayName;
      console.log(response);
      setFormInputData({
        email: "",
        password: "",
        uid: "",
      });
      const currentUser = await api.users.createUser(newInputValue);
      const updatedUsers = await api.users.fetchUsers();
      dispatch(selectedUser(currentUser));
      dispatch(setUsers(updatedUsers));
      navigate("/");
    } catch (e) {
      setError(e.message);
      console.error("Error adding document: ", e);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert variant="filled" color="error">
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleInputChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
          <Button
            onClick={GoogleLogin}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up with Google
          </Button>
        </Box>
        <Link href="/signin" variant="body2">
          {"Already have an account? Sign In"}
        </Link>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Register;
