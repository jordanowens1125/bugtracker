import React from 'react'
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {auth} from '../../utils/firebase'
import UsersTable from '../components/Users/UsersTable'

const Users = () => {
  //sign in with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async ()=>{
    try{
      const result = await signInWithPopup(auth,googleProvider)
      console.log(result)
    }catch(error){
      console.log('err:',error)
    }
  }
  return (
    <>
      <h1>Users Table</h1>
      <UsersTable/>
    </>
  )
}

export default Users