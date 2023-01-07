import { useNavigate } from "react-router-dom"
import { useEffect, } from "react";
import { useDispatch } from "react-redux";
import { removeSelectedUser, setLoginMethods, } from "../redux/actions/userActions";
import UserDashboard from "../components/Users/UserDashboard";
import { useUserAuth } from '../context/userAuthContext';
import { Button } from "@mui/material";

const checkIfThisIsADemoUser=(user)=>{
  const demoDeveloperEmail = import.meta.env.VITE_DEMO_DEVELOPER_EMAIL
  const demoAdminEmail = import.meta.env.VITE_DEMO_ADMIN_EMAIL
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
  const {user,logOut,getSignInMethods} = useUserAuth()
  const dispatch = useDispatch()
  const isThisADemoUser=checkIfThisIsADemoUser(user)
  const navigate = useNavigate()
  useEffect(()=>{
    if(!user){
    navigate('/signin')
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

  return (
      <>
        {isThisADemoUser?<Button variant ='contained' disabled>
          Edit Profile
          </Button> 
        :<Button onClick={handleEditProfileClick} variant ='outlined'>Edit Profile</Button>
        }
        <Button variant ='contained' onClick={signOut}>Sign Out</Button>
        <UserDashboard/>
      </>
      )
  };
  
  export default Home;