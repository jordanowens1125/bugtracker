import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import AdbIcon from "@mui/icons-material/Adb";
import MuiAlert from "@mui/material/Alert";
import { useUserAuth } from "../context/userAuthContext";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import PestControlIcon from "@mui/icons-material/PestControl";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MenuIcon from "@mui/icons-material/Menu";
import { clearMessage, setMessage } from "../redux/actions/messageActions";
import { removeSelectedUser } from "../redux/actions/userActions";
//home was excluded from list

const pages = [
  // { name: "Home", icon: <HomeIcon />, link: "/" },
  { name: "Projects", icon: <FormatListBulletedIcon />, link: "/Projects" },
  { name: "Bugs", icon: <PestControlIcon />, link: "/Bugs" },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const { user, logOut } = useUserAuth();
  const messageInfo = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [mobile, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearMessage());
  };


  const signOut = async () => {
    try {
      await logOut();
      dispatch(removeSelectedUser());
      dispatch(setMessage(`You have successfully signed out!`));
      navigate("/signin");
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <>
      <div className="flex">
        <nav className="desktop full-vh flex-column">
          {user && (
            <>
              <div className="flex-column aic space-around full-height">
                <div className="flex-column gap-lg">
                  <a href="/">Dashboard</a>
                  <a href="/Projects">Projects</a>
                  <a href="/Bugs">Bugs</a>
                  {currentUser.role === "Admin" && (
                    <a href="/manageusers">Manage Users</a>
                  )}
                  {/* <a href="/Bugs">Schedule</a> */}
                </div>
                <div className="flex-column gap-lg">
                  <a href="/Settings">Settings</a>
                  <a href="/Account">Account</a>
                  <a href="/Chat">Chat</a>
                  <span onClick={signOut} className="button-ghost">
                    Log Out
                  </span>
                </div>
              </div>
            </>
          )}
        </nav>
        <nav className="mobile">
          {mobile ? (
            <>
              <div
                className="modal margin-top-sm"
                onClick={() => setMobileOpen(false)}
              >
                {user && (
                  <Toolbar
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link to="/" aria-label="Home" className="flex aic">
                      <AdbIcon
                        sx={{
                          display: "flex",
                          color: "white",
                          mr: 1,
                        }}
                      />
                      Home
                    </Link>

                    {pages.map((page) => (
                      <Link
                        to={`/${page.name}`}
                        key={page.name}
                        aria-label={`Navigate to view ${page.name}`}
                      >
                        <Button
                          aria-label={`Go to ${page.name} page`}
                          sx={{ my: 2, color: "white", display: "block" }}
                        >
                          {page.icon}
                          {page.name}
                        </Button>
                      </Link>
                    ))}

                    {!user && (
                      <Link to="/SignIn" aria-label="Sign In">
                        <Button
                          aria-label="Sign In"
                          sx={{ my: 2, color: "white", display: "flex" }}
                        >
                          Sign In
                        </Button>
                      </Link>
                    )}

                    <Button
                      aria-label="Open User Options"
                      sx={{ my: 2, color: "white", display: "flex" }}
                    >
                      <Avatar alt={user.displayName} src={user.photoURL} />
                      Profile
                    </Button>
                    <Button onClick={signOut}>Log Out</Button>
                  </Toolbar>
                )}
              </div>
            </>
          ) : (
            <>{user && <MenuIcon onClick={() => setMobileOpen(true)} />}</>
          )}
        </nav>

        {/* Popup to show status or crud operations  */}
        <Snackbar
          open={messageInfo.open}
          autoHideDuration={4000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            variant="filled"
            severity="success"
            sx={{ width: "100%" }}
          >
            {messageInfo.text}
          </Alert>
        </Snackbar>
        <div className="test flex-column p-md">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Navbar;
