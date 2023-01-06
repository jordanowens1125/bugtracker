import { useNavigate } from "react-router-dom"
import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { removeSelectedUser, selectedUser,setLoginMethods,setUsers } from "../redux/actions/userActions";
import { useSelector } from "react-redux";
import { useUserAuth } from '../context/userAuthContext';
import api from "../api";
import { Button,Box,Typography,Modal } from "@mui/material";
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

const checkIfThisIsADemoUser=(user)=>{
  const demoDeveloperEmail = import.meta.env.VITE_DEMO_DEVELOPER_EMAIL
  const demoAdminEmail = import.meta.env.VITE_DEMO_DEVELOPER_EMAIL
  if(user){
    if (user.email==demoDeveloperEmail||user.email==demoAdminEmail){
    return true
  }
  }
  else{
    return false
  }
}

const Home = () => {
  const {user,logOut,removeUser,getSignInMethods} = useUserAuth()
  const users = useSelector((state)=>state.allUsers.users)
  const dispatch = useDispatch()
  const currentUser = useSelector((state)=>state.currentUser)
  const isThisADemoUser=checkIfThisIsADemoUser(user)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const findUserWithUID=async(user,users)=>{
    for(let i=0;i<users.length;i++){
      if(users[i].uid==user.uid){
        dispatch(selectedUser(users[i]))
        return ''
      }
    }
  }
  const navigate = useNavigate()
  useEffect(()=>{
    if(!user){
    navigate('/signin')
  }
  else{
    findUserWithUID(user,users)
  }
  },[user])

  const signOut =async()=>{
    try{
      await logOut()
        dispatch(removeSelectedUser())
        navigate('/signin')
    }catch(e){
      console.log('Error: ',e)
    } 
  }

  const handleEditProfileClick=async()=>{
    const methods = await getSignInMethods()
    dispatch(setLoginMethods(methods))
    navigate('/editprofile')
  }
  const deleteAccount=async()=>{
    try{
      await removeUser()
      await api.users.deleteUser(currentUser)
      dispatch(removeSelectedUser())
      const updatedUsers = await api.users.fetchUsers()
      dispatch(setUsers(updatedUsers))
    }catch(e){
      console.log(e)
      console.log(e)
      if(e.message =='(auth/requires-recent-login)'){
        console.log(e.message)
      }
    } 
  }

  return (
      <>
      <Modal
        open={open}
        onClose={handleClose}
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
        </Box>
      </Modal>
        {isThisADemoUser?<Button variant ='contained' disabled>
          Edit Profile
          </Button> 
        :<Button onClick={handleEditProfileClick} variant ='outlined'>Edit Profile</Button>
        }
        <Button variant ='contained' onClick={signOut}>Sign Out</Button>
        {isThisADemoUser?
        <Button variant="contained" disabled  startIcon={<DeleteIcon />}>
          Delete Account
        </Button>:
        <Button variant="contained" onClick={handleOpen} color='error' startIcon={<DeleteIcon />}>
          Delete Account
        </Button>} 
      </>
      )
  };
  
  export default Home;