import React from 'react'
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {auth} from '../../utils/firebase'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom"
import {useAuthState} from 'react-firebase-hooks/auth'
import { useEffect,useState,useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserAuth } from '../context/userAuthContext';
import { Alert } from '@mui/material';
import { selectedUser } from '../redux/actions/userActions';
import api from '../api/index'

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Bug Tracker
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

const searchForMember=(uid,users)=>{
  for (let i=0;i<users.length;i++){
    if (users[i].uid==uid){
      return users[i]
    }
  }
  return false
}

const theme = createTheme();

const SignIn =()=>{
  const [user,loading] = useAuthState(auth)
  const users =useSelector((state)=>state.allUsers.users)
  const dispatch=useDispatch()
  
  const [formInputData,setFormInputData]=useState({
    name:'',
    password:''
  })
  
  const {logIn,googleSignIn}=useUserAuth()
  const [error,setError]=useState('')
  const navigate = useNavigate()
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('')
    try {
      await logIn(formInputData.email,formInputData.password)
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }
  useEffect(()=>{
    if(user){
      navigate('/')
  }
  },[user])

  const SignInAsDemoDeveloper=async()=>{
    setError('')
    try {
      const demoDeveloperPassword = import.meta.env.VITE_DEMO_DEVELOPER_PASSWORD
      const demoDeveloperEmail = import.meta.env.VITE_DEMO_DEVELOPER_EMAIL
      const result = await logIn(demoDeveloperEmail,demoDeveloperPassword)
      const currentUser = searchForMember(result.user.uid,users)
      dispatch(selectedUser(currentUser))
      navigate('/')
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }
  const SignInAsDemoAdmin=async()=>{
    setError('')
      try{
          const demoAdminPassword = import.meta.env.VITE_DEMO_DEVELOPER_PASSWORD
          const demoAdminEmail = import.meta.env.VITE_DEMO_DEVELOPER_EMAIL
          const result =await logIn(demoAdminEmail,demoAdminPassword)
          const currentUser = searchForMember(result.user.uid,users)
          dispatch(selectedUser(currentUser))
          navigate('/')
      }catch(error){
        console.log(error)
      setError(error)
      }
  }
  //sign in with google
  const GoogleLogin = async(e)=>{
    //setError('')
    try{
      const result = await googleSignIn()
      navigate(`/`)
    }catch(error){
      setError(error.message)
    }
}
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Button
                onClick={SignInAsDemoDeveloper}
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                >Log In as demo developer
              </Button>
              <Button
                onClick={SignInAsDemoAdmin}
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                >Log In as demo admin
              </Button>
            {error && <Alert variant='filled' color='error'>{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
          </Box>
          <Button
              onClick={GoogleLogin}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login with Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotpassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )}

  export default SignIn