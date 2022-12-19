import React from 'react'
import { Navigate } from 'react-router'
import { useUserAuth } from '../context/userAuthContext';


const ProtectedRoute = ({children}) => {
    let {user} = useUserAuth();
    if(!user){
       return <Navigate to='/signin'/>
    }
  return (
    children
  )
}

export default ProtectedRoute