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
import Bug from "./pages/Bug";
import ManageMembers from "./pages/ManageMembers";
import ManageUsers from "./pages/ManageUsers";
import CreateProject from "./pages/CreateProject";
import DemoUserSignin from "./pages/DemoUserSignin";
import Settings from "./pages/Settings";
import RequireAuth from "./components/RequireAuth";
import SignedOut from "./components/SignedOut";
import CreateUser from "./pages/CreateUser";
import DeleteUsers from "./pages/DeleteUsers";
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
              <Route path="createuser" element={<CreateUser />} />
              {/* <Route path="deleteusers" element={<DeleteUsers />} /> */}

              {/* <Route path="chat" element={<Chat />} /> */}
              <Route path="settings" element={<Settings />} />
              <Route path="unauthorized" element={<Unauthorized />} />
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
