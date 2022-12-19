import React from 'react'
import {auth} from '../../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

const User = () => {
    const [user,loading] = useAuthState(auth)
  return (
    <>
      <div>hi</div>
      <h1>Home</h1>
      <h1>Home</h1>
      <h1>Home</h1>
    </>
  )
}

export default User