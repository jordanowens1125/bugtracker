import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Bugs from "./pages/Bugs";
import Projects from "./pages/Projects";
import NoPage from "./pages/NoPage";
import Project from "./pages/Project";
import "./App.css";
import Unauthorized from "./pages/Unauthorized";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UserAuthContextProvider } from "./context/userAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Bug from "./pages/Bug";
import ManageMembers from "./pages/ManageMembers";
import ManageUsers from "./pages/ManageUsers";
import CreateProject from "./pages/CreateProject";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import DemoUserSignin from "./pages/DemoUserSignin";
import Settings from "./pages/Settings";
// import Chat from "./pages/Chat";

function App() {
  const dispatch = useDispatch();
  const [currentUser, setUser] = useState();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    // console.log(getAuth())
    return unsubscribe;
  }, [currentUser, dispatch]);

  return (
    <main className="light-mode" id="App">
      <BrowserRouter>
        <UserAuthContextProvider>
          <Routes>
            <Route path="/" element={<Layout user={currentUser} />}>
              {/*public routes */}
              <Route path="signin" element={<SignIn />} />
              {/* <Route path="register" element={<Register />} /> */}
              <Route path="unauthorized" element={<Unauthorized />} />
              <Route path="demo" element={<DemoUserSignin />} />
              {/* <Route path="forgotpassword" element={<ForgotPassword />} /> */}

              {/*We want to protect these routes */}
              <Route element={<ProtectedRoute user={currentUser} />}>
                <Route index element={<Home />} />
                <Route path="bugs" element={<Bugs />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<Project />} />
                <Route path="bugs/:id" element={<Bug />} />
                {/* Admin/Project Managers only */}
                <Route
                  path="projects/:id/managemembers"
                  element={<ManageMembers />}
                />
                {/* Admin only */}
                <Route path="manageusers" element={<ManageUsers />} />
                {/* <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<User />} /> */}
                <Route path="createproject" element={<CreateProject />} />
                {/* <Route path="chat" element={<Chat />} /> */}
                <Route path="settings" element={<Settings />} />
              </Route>
              {/*catch all */}
              <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </UserAuthContextProvider>
      </BrowserRouter>
    </main>
  );
}

export default App;
