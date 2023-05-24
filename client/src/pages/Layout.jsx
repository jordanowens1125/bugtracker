import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserAuth } from "../context/userAuthContext";
import { clearMessage, setMessage } from "../redux/actions/messageActions";
import { removeSelectedUser } from "../redux/actions/userActions";

const Navbar = ({user}) => {
  const currentUser = useSelector((state) => state.currentUser);
  const { logOut } = useUserAuth();
  const [theme, setTheme] = useState("light-mode");
  const messageInfo = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [mobile, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (messageInfo.open) {
      setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
    }
  }, [messageInfo, dispatch]);

  const changeTheme = () => {
    const element = document.getElementById("App");
    if (theme === "dark-mode") {
      element?.classList.remove("dark-mode");
      setTheme("light-mode");
      element?.classList.add("light-mode");
    } else {
      element?.classList.remove("light-mode");
      setTheme("dark-mode");
      element?.classList.add("dark-mode");
    }
  };

  const handleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearMessage());
  };

  const handleMobileOpen = () => {
    setMobileOpen(true);
    document.body.style.overflow = "hidden";
    const display = document.getElementById("mobile-display");
    display.style.position = "fixed";
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
    document.body.style.overflow = "unset";
    const display = document.getElementById("mobile-display");
    display.style.position = "unset";
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
      <div className="flex desktop desktop-display">
        {user && (
          <nav className="full-vh flex-column desktop-nav primary">
            <div className="flex-column space-around full-height ">
              <div className="flex-column gap-lg">
                <a href="/">Dashboard</a>
                <a href="/Projects">Projects</a>
                <a href="/Bugs">Bugs</a>
                {/* <a href="/Bugs">Schedule</a> */}
              </div>
              {currentUser.role === "Admin" && (
                <div className="flex-column gap-lg">
                  <a href="/manageusers">Manage Users</a>
                  <a href="/createproject">Create Project</a>
                </div>
              )}

              <div className="flex-column gap-lg">
                <a href="/Settings">Settings</a>
                {/* <a href="/Chat">Chat</a> */}
                {/* <label className="switch">
                  <input type="checkbox" aria-label="Change Color Theme" />
                  <span className="slider round" onClick={changeTheme}></span>
                </label> */}
                <span onClick={signOut} className="p-sm">
                  Log Out
                </span>
              </div>
            </div>
          </nav>
        )}

        {messageInfo.open && (
          <>
            <div className="noti">
              <button className="button-primary" onClick={handleAlertClose}>
                Close
              </button>
              {messageInfo.text}
            </div>
          </>
        )}

        <div className="right flex-column p-md">
          <Outlet />
        </div>
      </div>

      {/* Mobile */}
      <div className="mobile" id="mobile-display">
        <div className="flex-column">
          {user && (
            <>
              {mobile ? (
                <>
                  <nav className="mobile-nav" onClick={handleMobileClose}>
                    {user && (
                      <>
                        <div className="flex-column space-around aic jcc full-height full-width">
                          <a href="/">Dashboard</a>
                          <a href="/Projects">Projects</a>
                          <a href="/Bugs">Bugs</a>
                          {currentUser.role === "Admin" && (
                            <a href="/manageusers">Manage Users</a>
                          )}
                          {currentUser.role === "Admin" && (
                            <a href="/createproject">Create Project</a>
                          )}
                        </div>
                      </>
                    )}
                  </nav>
                </>
              ) : (
                <>
                  <div className="open-mobile-nav" onClick={handleMobileOpen}>
                    Menu item to open mobile nav
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {/* Popup to show status or crud operations  */}
        {/* <Snackbar
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
        </Snackbar> */}
        <div className="bottom flex-column aic jcc">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Navbar;
