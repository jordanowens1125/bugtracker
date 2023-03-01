import React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserAuth } from "../context/userAuthContext";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { selectedUser, setUsers } from "../redux/actions/userActions";
import api from "../api/index";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/" aria-label="Link to Material UI">
        Bug Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const searchForMember = (uid, users) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].uid === uid) {
      return users[i];
    }
  }
  return false;
};

const theme = createTheme();

const SignIn = () => {
  const { user } = useUserAuth();
  const users = useSelector((state) => state.allUsers.users);
  const dispatch = useDispatch();

  const { logIn, googleSignIn } = useUserAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const SignInAsDemoDeveloper = async () => {
    setError("");
    try {
      const demoDeveloperPassword =
        process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD;
      const demoDeveloperEmail = process.env.REACT_APP_DEMO_DEVELOPER_EMAIL;
      const result = await logIn(demoDeveloperEmail, demoDeveloperPassword);
      const currentUser = searchForMember(result.user.uid, users);
      dispatch(selectedUser(currentUser));
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const SignInAsDemoAdmin = async () => {
    setError("");
    try {
      const demoAdminPassword = process.env.REACT_APP_DEMO_ADMIN_PASSWORD;
      const demoAdminEmail = process.env.REACT_APP_DEMO_ADMIN_EMAIL;
      const result = await logIn(demoAdminEmail, demoAdminPassword);
      const currentUser = searchForMember(result.user.uid, users);
      dispatch(selectedUser(currentUser));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  //sign in with google
  const GoogleLogin = async (e) => {
    try {
      const result = await googleSignIn();
      const newUser = {};
      newUser.name = result.user.displayName;
      newUser.uid = result.user.uid;
      newUser.email = result.user.email;
      newUser.photoURL = result.user.photoURL;
      //use api to find or create a user
      //will use result.user displayName, photoURL, email, uid
      const userToBeFoundOrCreated = await api.users.findOrCreateUser(newUser);
      dispatch(selectedUser(userToBeFoundOrCreated));
      //in case we have to create a new member lets get users and set them again
      const updatedUsers = await api.users.fetchUsers();
      dispatch(setUsers(updatedUsers));
      navigate(`/`);
    } catch (error) {}
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
          <Avatar sx={{ m: 1, bgcolor: "white", border: "2px solid #1976d2" }}>
            <LockOutlinedIcon color="primary" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Button
            aria-label="Login as a demo developer"
            onClick={SignInAsDemoDeveloper}
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In as demo developer
          </Button>
          <Button
            aria-label="Login as a demo admin"
            onClick={SignInAsDemoAdmin}
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In as demo admin
          </Button>
          {error && (
            <Alert variant="filled" color="error">
              {error}
            </Alert>
          )}
          <Button
            onClick={GoogleLogin}
            aria-label="Login with google"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login with Google
          </Button>
          <Button
            aria-label="Sign up with google"
            type="submit"
            fullWidth
            variant="contained"
            onClick={GoogleLogin}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
