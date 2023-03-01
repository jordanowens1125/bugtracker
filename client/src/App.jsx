import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Bugs from "./pages/Bugs";
import Projects from "./pages/Projects";
import NoPage from "./pages/NoPage";
import Users from "./pages/Users";
import SignIn from "./pages/SignIn";
import Project from "./pages/Project";
import "./App.css";
// import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
// import ForgotPassword from "./pages/ForgotPassword";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProjects } from "./redux/actions/projectActions";
import { setBugs } from "./redux/actions/bugActions";
import { setUsers } from "./redux/actions/userActions";
import api from "./api/index";
import { UserAuthContextProvider } from "./context/userAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import User from "./pages/User";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

function App() {
  const dispatch = useDispatch();
  const [currentUser, setUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);

    async function fetchData() {
      const all = await api.aggregate.getAll()
      dispatch(setUsers(all.users));
      dispatch(setProjects(all.projects));
      dispatch(setBugs(all.bugs));
    }

    fetchData();
    return unsubscribe;
  }, [currentUser, dispatch]);
  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/*public routes */}
            <Route path="signin" element={<SignIn />} />
            {/* <Route path="register" element={<Register />} /> */}
            <Route path="unauthorized" element={<Unauthorized />} />
            {/* <Route path="forgotpassword" element={<ForgotPassword />} /> */}

            {/*We want to protect these routes */}
            <Route element={<ProtectedRoute user={currentUser} />}>
              <Route index element={<Home />} />
              <Route path="bugs" element={<Bugs />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<Project />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<User />} />
            </Route>
            {/* <Route index element={<Home />} />
          <Route path="bugs" element={<Bugs />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<Project/>} />
          <Route path="editprofile" element={<EditProfile />} />
          <Route path="updatepassword" element={<UpdatePassword />} />
          <Route path="users" element={<Users/>} /> */}
            {/*catch all */}
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
