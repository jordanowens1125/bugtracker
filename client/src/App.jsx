import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Tickets from "./pages/Tickets";
import Projects from "./pages/Projects";
import NoPage from "./pages/NoPage";
import Project from "./pages/Project";
import "./App.css";
import Bug from "./pages/Bug";
import ManageUsers from "./pages/ManageUsers";
import CreateProject from "./pages/CreateProject";
import CreateTicket from "./pages/CreateTicket";
import DemoUserSignin from "./pages/DemoUserSignin";
import RequireAuth from "./components/ProtectedRoutes/RequireAuth";
import SignedOut from "./components/ProtectedRoutes/SignedOut";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute";
import AdminOnly from "./pages/AdminOnly";
import ProjectManagerRoute from "./components/ProtectedRoutes/ProjectManagerRoute";
import PMOnly from "./pages/PMOnly";
import AdminDashboard from "./components/Users/AdminDashboard";
import DeveloperDashboard from "./components/Users/DeveloperDashboard";
import ProjectManagerDashboard from "./components/Users/ProjectManagerDashboard";
import DeveloperRoute from "./components/ProtectedRoutes/DeveloperRoute";
import DevOnly from "./pages/DevOnly";
import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
//import SignUp from "./pages/SignUp";
// import Chat from "./pages/Chat";

function App() {
  return (
    <main className="light-mode" id="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/*We want to protect these routes */}
            <Route element={<RequireAuth />}>
              <Route index element={<Home />} />
              <Route path="tickets" element={<Tickets />} />

              <Route path="profile" element={<Profile />} />

              <Route path="projects/:id" element={<Project />} />
              <Route path="bugs/:id" element={<Bug />} />
              <Route path="createticket" element={<CreateTicket />} />
              {/* <Route path="settings" element={<Settings />} /> */}
              {/* <Route path="chat" element={<Chat />} /> */}

              <Route element={<ProjectManagerRoute />}>
                {/* Admin/Project Managers only */}
                <Route path="createproject" element={<CreateProject />} />
                <Route
                  path="projectmanager"
                  element={<ProjectManagerDashboard />}
                />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
                {/* Admin only */}
                <Route path="manageusers" element={<ManageUsers />} />
                <Route path="profile/:id" element={<Profile />} />
                <Route path="projects" element={<Projects />} />
              </Route>

              <Route element={<DeveloperRoute />}>
                <Route path="developer" element={<DeveloperDashboard />} />
              </Route>

              <Route path="admin/unauthorized" element={<AdminOnly />} />
              <Route path="projectmanager/unauthorized" element={<PMOnly />} />
              <Route path="developer/unauthorized" element={<DevOnly />} />
              <Route path="*" element={<NoPage />} />
            </Route>

            {/*public routes */}
            <Route element={<SignedOut />}>
              <Route path="signin" element={<SignIn />} />
              {/* <Route path="signup" element={<SignUp />} /> */}
              <Route path="demo" element={<DemoUserSignin />} />
            </Route>
          </Route>
          {/*catch all */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
