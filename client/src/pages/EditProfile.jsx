
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Modal from '@mui/material/Modal'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import React,{ useState,useEffect } from 'react'
import { useUserAuth } from '../context/userAuthContext'
import { useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import api from '../api/index'
import { removeSelectedUser, setUsers } from '../redux/actions/userActions'
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditProfile = () => {
    const {user,removeUser,updateUserPassword,reauthenticateUser,getSignInMethods,
      googleSignIn,updateUserEmail,logOut} = useUserAuth()
    const dispatch=useDispatch()
    const methods = useSelector((state)=>state.loginMethods)
    let hasPassword;
    let hasGoogleAuth;
    if(methods.includes('google.com')){
      hasGoogleAuth=true
    }
    if(methods.includes('password')){
      hasPassword=true;
    }

    const navigate = useNavigate()
    const [message,setMessage]=useState('')
    const [open,setOpen]=useState(false)
    const [editEmail,setEditEmail]=useState(false)
    const [editPassword,setEditPassword]=useState(false)
    const [deleteOpen,setDeleteOpen]=useState(false)
    const [newEmail,setNewEmail]=useState('')
    const [authenticationError,setAuthenticationError]=useState('')
    const [emailpasswordError, setEmailPasswordError]=useState('')
    const [newPassword,setNewPassword]=useState({
      newpassword:'',
      validatepassword:'',
    }) 
    const [emailordeleteororpassword,setEmailorDeleteorPassword]=useState('')
    const [formInputData,setFormInputData]=useState({
        email:'',
        password:'',
    })
    const currentUser= useSelector((state)=>state.currentUser)
    useEffect(()=>{
      if(!user){
        navigate('/')
      }else{

      }
    },[user])

    const handleAuthentication=async(e)=>{
            e.preventDefault()
            setAuthenticationError('')
            const wasUserAuthenticated = await reauthenticateUser(formInputData)
            if(wasUserAuthenticated==true){
              setOpen(false)
              if(emailordeleteororpassword=='password'){
                setEditPassword(true)
              }
              if(emailordeleteororpassword=='email'){
                setEditEmail(true)
              }
              if(emailordeleteororpassword=='delete'){
                setDeleteOpen(true)
              }
            }
            else{
              setAuthenticationError(wasUserAuthenticated.message)
            }
        }

    const handleEmailInputChange=(e)=>{
      setNewEmail(e.target.value)
    }
    
    const handlePasswordInputChange=(e)=>{
      const inputFieldValue = e.target.value;
      const inputFieldName =e.target.id||e.target.name//target name for the bugs select
      const newInputValue = {...newPassword,[inputFieldName]:inputFieldValue}
      setNewPassword(newInputValue);
    }

    const updateEmail=async(e)=>{
      e.preventDefault()
      setMessage('')
      setEmailPasswordError('')
      const result =await updateUserEmail(newEmail)
      if(result[0]){
        const editedUser = {...currentUser}
        editedUser['email']= newEmail
        await api.users.updateUser(currentUser._id,editedUser)
        const updatedUsers = await api.users.fetchUsers()
        dispatch(setUsers(updatedUsers))
        setMessage(result[1])              
        setEditEmail(false)
        setEmailorDeleteorPassword('')
        setTimeout(()=>{
          logOut()   
          dispatch(removeSelectedUser())              
          navigate('/signin')
        },3000)
      }
      else{
        setEmailPasswordError(result[1])
      }
    }

    const updatePassword=async(e)=>{
      e.preventDefault()
      setMessage('')
      setEmailPasswordError('')
      const result = await updateUserPassword(newPassword.newpassword)
      if(result[0]){
        const editedUser = {...currentUser}
        editedUser['email']= newEmail
        await api.users.updateUser(currentUser._id,editedUser)
        const updatedUsers = await api.users.fetchUsers()
        dispatch(setUsers(updatedUsers))
        setMessage(result[1])
        setEditPassword(false)
        setEmailorDeleteorPassword('')
        setTimeout(()=>{
          setMessage('')
          logOut()           
          dispatch(removeSelectedUser())      
          navigate('/signin')
        },3000)
      }
      else{
        setEmailPasswordError(result[1])
      }
    }

    const handleClose = () => setOpen(false);
    const handleDeleteClose =()=>{
      setDeleteOpen(false)
      setEditEmail(false)
      setEditPassword(false)
    }
    const handleAuthenticationChange=(e)=>{
        const inputFieldName=e.target.id
        const inputFieldValue=e.target.value
        const newInputValue={...formInputData}
        newInputValue[inputFieldName]=inputFieldValue
        setFormInputData(newInputValue)
    }
    const changeEmail=()=>{
        setOpen(true)
        setEmailPasswordError('')
        setEditPassword(false)
        setEmailorDeleteorPassword('email')
    }
    const handleDeleteOpen=()=>{
      setOpen(true)
      setEmailPasswordError('')
      setEditPassword(false)
      setEditEmail(false)
      setEmailorDeleteorPassword('delete')
    }
    const changePassword=()=>{
      setOpen(true)
      setEmailPasswordError('')
      setEditEmail(false)
      setEmailorDeleteorPassword('password')
    }
    //sign in with google
  const GoogleLogin = async(e)=>{
    setAuthenticationError('')
    setMessage('')
    try{
      const result = await googleSignIn()
      if(emailordeleteororpassword=='email'){
        setEditEmail(true)
      }
      else if(emailordeleteororpassword=='delete'){
        setDeleteOpen(true)
      }
      
      setOpen(false)
    }catch(error){
      setAuthenticationError(error.message)
    }    
}

const cancelEdit=()=>{
  setEditEmail(false)
  setEditPassword(false)
  setDeleteOpen(false)
}

const deleteAccount=async()=>{
  try{
    await removeUser()
    await api.users.deleteUser(currentUser)
    dispatch(removeSelectedUser())
    const updatedUsers = await api.users.fetchUsers()
    dispatch(setUsers(updatedUsers))

  }catch(e){
  } 
}
  return (
    <>
        <div>Edit Profile</div>
        <Button onClick={changeEmail}>Change Email</Button>     
        {hasPassword?
        <Button onClick={changePassword}>Change Password</Button>
        :
        <></>}           
        <Button variant="outlined" onClick={handleDeleteOpen} color='error' startIcon={<DeleteIcon />}>
          Delete Account
        </Button>
        {message && <Alert severity='success'>{message}</Alert>}
        {emailpasswordError && <Alert severity="error">{emailpasswordError}</Alert>}
        {open? 
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box component="form" sx={style} onSubmit={handleAuthentication}  
                > 
                <div>Please verify your credentials before editing your account!</div>
                
                    {authenticationError && <Alert severity="error">{authenticationError}</Alert>}
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleAuthenticationChange}
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
                    onChange={handleAuthenticationChange}
                    />
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Verify Credentials
                    </Button>
                    {hasGoogleAuth?
                    <Button
                        onClick={GoogleLogin}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                        >Verify Credentials Through Google
                    </Button>
                    :
                    <></>}
                </Box>
           </Modal>
          :
          <></>}
          {editEmail? 
          <Paper component="form" onSubmit={updateEmail}  
                  > 
                  <div>Enter your new email below. Upon completion you will be redirected to the sign in page.</div>
                      <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="newemail"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      onChange={handleEmailInputChange}
                      autoFocus
                      />
                      <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      >
                      Update Email
                      </Button>
                      <Button
                      fullWidth
                      onClick={cancelEdit}
                      variant="outlined"
                      sx={{ mt: 3, mb: 2 }}
                      >
                      Cancel
                      </Button>
                  </Paper>
            :
            <></>}
            {editPassword? 
            <Paper component="form" onSubmit={updatePassword}  
                  > 
                  <div>Enter your new password</div>
                      <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="newpassword"
                      label="Password"
                      name="password"
                      onChange={handlePasswordInputChange}
                      autoFocus
                      />
                      <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="validatepassword"
                      label="Re-enter new password"
                      name="password"
                      onChange={handlePasswordInputChange}
                      autoFocus
                      />
                      <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      >
                      Update Password
                      </Button>
                  </Paper>
            :
            <></>}
            <Button>
              <Link href="/" variant="body2">
                {"Back To Home"}
              </Link>
            </Button>
        <Modal
            open={deleteOpen}
            onClose={handleDeleteClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete your account?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This cannot be undone!
          </Typography>
          <Button onClick={deleteAccount} variant='outlined' color='error'>Yes, Delete my account!</Button>
          <Button onClick={cancelEdit} variant='outlined' >No, I changed my mind!</Button>
        </Box>
      </Modal>
    </>
  )
}

export default EditProfile