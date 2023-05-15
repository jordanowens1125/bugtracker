import { Outlet, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserAuth } from "../context/userAuthContext";

import { clearMessage, setMessage } from "../redux/actions/messageActions";
import { removeSelectedUser } from "../redux/actions/userActions";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);
  //console.log(currentUser);
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
      <div className="flex desktop desktop-display">
        <nav className="full-vh flex-column desktop-nav primary">
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
                  <span onClick={signOut} className="p-sm">
                    Log Out
                  </span>
                </div>
              </div>
            </>
          )}
        </nav>
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
        <div className="right flex-column p-md">
          <Outlet />
        </div>
      </div>

      {/* Mobile */}
      <div className="mobile mobile-display">
        <nav className="flex-column">
          {user && (
            <>
              {mobile ? (
                <>
                  <div
                    className="modal "
                    onClick={() => setMobileOpen(false)}
                  >
                    {user && (
                      <>
                        <div className="flex-column space-around aic jcc full-height full-width">
                          <a href="/">Dashboard</a>
                          <a href="/Projects">Projects</a>
                          <a href="/Bugs">Bugs</a>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="mobile-nav"
                    onClick={() => setMobileOpen(true)}
                  >
                    Menu item to open mobile nav
                  </div>
                </>
              )}
            </>
          )}
        </nav>
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
        <div className="bottom">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Navbar;
