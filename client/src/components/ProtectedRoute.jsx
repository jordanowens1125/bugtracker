import React from 'react'
import { Navigate } from 'react-router'
import { useUserAuth } from '../context/userAuthContext';
import {useDispatch} from 'react-redux'
import {selectedUser} from '../redux/actions/userActions'

const ProtectedRoute = ({children}) => {
    let {user} = useUserAuth();
    const dispatch = useDispatch()
    if(!user){
       return <Navigate to='/signin'/>
    }else{
      //dispatch(selectedUser(user))
    }
  return (
    children
  )
}

export default ProtectedRoute