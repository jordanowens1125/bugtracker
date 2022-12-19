import React from 'react'
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {auth} from '../../utils/firebase'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom"
import {useAuthState} from 'react-firebase-hooks/auth'
import { useEffect } from 'react';
import { getDatabase, push, ref, set } from "firebase/database";
import { useState } from 'react';
import api from '../api/index'
import { useUserAuth } from '../context/userAuthContext';
import { Alert } from '@material-ui/lab';


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

const theme = createTheme();

async function writeUserData(name,password) {
  const db = getDatabase();
  const newUser = await push(ref(db, 'users/'), {
    email: email,
    password: password,
  });
  //get user id below
  //console.log(newUser.key) 
}

const EMAIL_REGEX =1
const PASSWORD_REGEX=1

const Register =()=>{
  const [user,loading] = useAuthState(auth)
  const [formInputData,setFormInputData]=useState({
    name:'',
    password:''
  })
  const {signUp}=useUserAuth()
  const [error,setError]=useState('')

  const handleInputChange=(e)=>{  
    const inputFieldValue = e.target.value;
    const inputFieldName =e.target.id||e.target.name//target name for the bugs select
    //if name is start or deadline change format to string 
    const newInputValue = {...formInputData,[inputFieldName]:inputFieldValue}
    setFormInputData(newInputValue);
  }
  const navigate = useNavigate()
  useEffect(()=>{
    if(user){
    navigate('/')
  }
  },[user])
  
  //sign in with google
  const GoogleLogin = async ()=>{
    const googleProvider = new GoogleAuthProvider()
    try{
      const result = await signInWithPopup(auth,googleProvider)
      console.log(result)
      navigate(`/`)
    }catch(error){
      console.log('err:',error)
    }
}
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError('')
    try {
      await signUp(formInputData.email,formInputData.password)
      api.users.createUser(formInputData)
      navigate('/')
    } catch (e) {
      setError(e.message)
      console.error("Error adding document: ", e);
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
            Sign Up
          </Typography>
          {error && <Alert variant='filled' color='error'>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            >Sign Up
            </Button>
          </Box>
          <Button
              onClick={GoogleLogin}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >Sign Up with Google
          </Button>
        </Box>
          <Link href="/signin" variant="body2">
            {"Already have an account? Sign In"}
          </Link>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )}

  export default Register