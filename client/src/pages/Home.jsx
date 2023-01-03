import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useUserAuth } from '../context/userAuthContext';
const Home = () => {
  const {user,logOut} = useUserAuth();
  const navigate = useNavigate()
  //if(loading) return <h1>Loading...</h1>
 
  useEffect(()=>{
    if(!user){
    navigate('/signin')
  }
  },[user])
  const signOut =async()=>{
    try{
      await logOut()
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