import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Bugs from "./pages/Bugs";
import Projects from "./pages/Projects";
import NoPage from "./pages/NoPage";
import Users from "./pages/Users"
import SignIn from "./pages/SignIn"
import Project from './pages/Project'
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized'
import ForgotPassword from './pages/ForgotPassword'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from './utils/firebase'
import { useEffect } from "react";
import { useDispatch } from 'react-redux'
import { setProjects } from "./redux/actions/projectActions";
import { setBugs } from "./redux/actions/bugActions";
import { setUsers,selectedUser} from "./redux/actions/userActions";
import api from './api/index'
import { UserAuthContextProvider } from "./context/userAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdatePassword from "./pages/UpdatePassword";
import EditProfile from "./pages/EditProfile";

function App() {
  const dispatch =useDispatch()
  const {user,loading,logOut} = useAuthState(auth)
  useEffect(()=>{
    async function fetchData(){
      const users = await api.users.fetchUsers()
      dispatch(setUsers(users))
      const projects = await api.projects.fetchProjects()
      dispatch(setProjects(projects))
      const bugs = await api.bugs.fetchBugs()
      dispatch(setBugs(bugs))
      const findUserWithUID=(user,users)=>{
        if(user){
        for(let i=0;i<users.length;i++){
            if(users[i].uid==user.uid){
              dispatch(selectedUser(users[i]))
              return ''
            }
          }
        }
        else{

        }
      }
      findUserWithUID(user,users)
    }
    fetchData()
  },[user])
  return (
    <BrowserRouter>
    <UserAuthContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/*public routes */}
          <Route path="signin" element={<SignIn />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="forgotpassword" element={<ForgotPassword/>} /> 
          {/*We want to protect these routes */}
          {/* <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="bugs" element={<ProtectedRoute><Bugs /></ProtectedRoute>} />
          <Route path="bugs/:id" element={<ProtectedRoute><Bug /></ProtectedRoute>} />
          <Route path="projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="projects/:id" element={<ProtectedRoute><Project/></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
          <Route path="user" element={<ProtectedRoute><User/></ProtectedRoute>} />  */}
          <Route index element={<Home />} />
          <Route path="bugs" element={<Bugs />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<Project/>} />
          <Route path="editprofile" element={<EditProfile />} />
          <Route path="updatepassword" element={<UpdatePassword />} />
          <Route path="users" element={<Users/>} />
          {/*catch all */}
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
      </UserAuthContextProvider>
    </BrowserRouter>
  )
}

export default App
