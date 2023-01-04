import { useNavigate } from "react-router-dom"
import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { removeSelectedUser, selectedUser } from "../redux/actions/userActions";
import { useSelector } from "react-redux";
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../../utils/firebase'
import api from "../api";
import { Button,Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { deleteUser,reauthenticateWithCredential  } from "firebase/auth";

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
  const [user,logOut] = useAuthState(auth)
  const isThisADemoUser=checkIfThisIsADemoUser(user)
  const[formInputData,setFormInputData]=useState('')
  const [editMode,setEditMode]=useState('')
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const users = useSelector((state)=>state.allUsers.users)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!user){
    navigate('/signin')
  }
  else{
    const findUserWithUID=async(user,users)=>{
      for(let i=0;i<users.length;i++){
        if(users[i].uid==user.uid){
          dispatch(selectedUser(users[i]))
          return ''
        }
      }
      const newUser = {email:user.email,uid:user.uid}
      const createdUser =await api.users.createUser(newUser)
      dispatch(selectedUser(createdUser))
    }
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

  const changeToEditMode =async()=>{
    //set edit mode to true
  }
  //if they click cancel
  const resetEditMode=async()=>{

  }
  const updatedAccount=async()=>{

  }
  const deleteAccount=async()=>{
    try{
      //const credential = promptForCredentials();
      await deleteUser(user).then((response)=>{
      })
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
        {isThisADemoUser?<></> :<Button variant ='outlined' onClick={changeToEditMode}>Edit Profile</Button>}
        <Button variant ='contained' onClick={signOut}>Sign Out</Button>
        {isThisADemoUser?<></>:<Button variant="contained" onClick={handleOpen} color='error' startIcon={<DeleteIcon />}>
          Delete Account
        </Button>} 
        
      </>
      )
  };
  
  export default Home;