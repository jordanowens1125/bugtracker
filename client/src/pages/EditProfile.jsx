import React from 'react'
import { Button,Box,TextField,Modal, Alert, Paper } from '@mui/material'
import { useState } from 'react'
import { useUserAuth } from '../context/userAuthContext'

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
    const {user,removeUser,reauthenticateUser,googleSignIn,updateUserEmail} = useUserAuth()
    const [message,setMessage]=useState('')
    const [open,setOpen]=useState(false)

    const [editEmail,setEditEmail]=useState(false)
    const [editPassword,setEditPassword]=useState(true)
    const [newEmail,setNewEmail]=useState('')
    const [newPassword,setNewPassword]=useState({
      newpassword:'',
      validatepassword:'',
    })
    const [emailorpassword,setEmailorPassword]=useState('')
    const [formInputData,setFormInputData]=useState({
        email:'',
        password:'',
    })

    const handleAuthentication=async(e)=>{
            e.preventDefault()
            const wasUserAuthenticated = await reauthenticateUser(formInputData)
            if(wasUserAuthenticated==true){
              setOpen(false)
              if(emailorpassword=='password'){
                setEditPassword(true)
              }
              if(emailorpassword=='email'){
                setEditEmail(true)
              }
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
      const result =await updateUserEmail(newEmail)
      setError('')
      setMessage(result)
      setEditEmail(false)
      setEmailorPassword('')
    }

    const handleClose = () => setOpen(false);
    
    const [error,setError]=useState('')
    const handleAuthenticationChange=(e)=>{
        const inputFieldName=e.target.id
        const inputFieldValue=e.target.value
        const newInputValue={...formInputData}
        newInputValue[inputFieldName]=inputFieldValue
        setFormInputData(newInputValue)
    }
    const changeEmail=()=>{
        setOpen(true)
        setEmailorPassword('email')
    }
    const changePassword=()=>{
      setOpen(true)
      setEmailorPassword('password')
    }
    //sign in with google
  const GoogleLogin = async(e)=>{
    setError('')
    setMessage('')
    try{
      const result = await googleSignIn()
      setOpen(false)
    }catch(error){
      setError(error.message)
    }
}
  return (
    <>
        <div>Edit Profile</div>
        <Button onClick={changeEmail}>Change Email</Button>                
        <Button onClick={changePassword}>Change Password</Button>
        {message && <Alert variant='outlined' color='success'>{message}</Alert>}
        {open? 
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" sx={style} onSubmit={handleAuthentication}  
                > 
                <Button
                        onClick={GoogleLogin}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                        >Verify Credentials Through Google
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
                </Box>
           </Modal>
          :
          <></>}
          {editEmail? 
          <Paper component="form" onSubmit={updateEmail}  
                  > 
                  <div>Enter your new email</div>
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
                  </Paper>
            :
            <></>}
            {editPassword? 
            <Paper component="form" onSubmit={updateEmail}  
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
            
    </>
  )
}

export default EditProfile