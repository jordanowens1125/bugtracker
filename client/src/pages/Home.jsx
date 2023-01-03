import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useUserAuth } from '../context/userAuthContext';
import { useDispatch } from "react-redux";
import { removeSelectedUser, selectedUser } from "../redux/actions/userActions";
import { useSelector } from "react-redux";

const findUserWithUID=(uid,users)=>{
  for(let i=0;i<users.length;i++){
    if(users[i].uid==uid){
      return users[i]
    }
  }
}

const Home = () => {
  const {user,logOut} = useUserAuth();
  const users = useSelector((state)=>state.allUsers.users)
  const navigate = useNavigate()
  //if(loading) return <h1>Loading...</h1>
  const dispatch = useDispatch()
  useEffect(()=>{
    if(!user){
    navigate('/signin')
  }
  else{
    const currentUser = findUserWithUID(user.uid,users)
    dispatch(selectedUser(currentUser))
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
  return (
      <>
        <div>hi</div>
        <h1>Home</h1>
        <h1>Home</h1>
        <h1>Home</h1>
        <button onClick={signOut}>Sign Out</button>
      </>
      )
  };
  
  export default Home;