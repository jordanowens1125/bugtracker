import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { useLogOut } from "../hooks/useLogOut.js";
import Hamburger from "../assets/Hamburger";
import useMessageContext from "../hooks/messageContext";

const Navbar = ({ theme, setTheme }) => {
  const { signOut } = useLogOut();
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  const [mobile, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (messageInfo.display) {
      setTimeout(() => {
        messageInfo.dispatch({ type: "CLEAR" });
      }, 5000);

      // if (!user) {
      //   signOut()
      // }
    }
  }, [messageInfo, user]);

  const changeTheme = () => {
    const element = document.getElementById("App");
    if (theme === "dark-mode") {
      element?.classList.remove("dark-mode");
      setTheme("light-mode");
      element?.classList.add("light-mode");
      localStorage.setItem("theme", "light-mode");
    } else {
      element?.classList.remove("light-mode");
      setTheme("dark-mode");
      element?.classList.add("dark-mode");
      localStorage.setItem("theme", "dark-mode");
    }
  };

  const handleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    messageInfo.dispatch({ type: "CLEAR" });
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

  const logOut = async () => {
    try {
      signOut();
      messageInfo.dispatch({
        type: "SHOW",
        payload: "You have successfully signed out!",
      });
      navigate("/signin");
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <>
      <div className="flex desktop desktop-display aic jcc">
        {user && (
          <nav className="full-vh flex-column desktop-nav primary">
            <div className="flex-column space-around full-height ">
              <div className="flex-column gap-lg">
                {user.role === "Project Manager" && (
                  <a href="/">Manage Projects</a>
                )}

                {user.role === "Developer" && <a href="/">My Tickets</a>}

                {user.role === "Admin" && <a href="/">Home</a>}

                {/* <a href="/">My Tickets</a>
                <a href="/createticket">Submit Ticket</a> */}

                {user.role === "Admin" && (
                  <div className="flex-column gap-lg">
                    <a href="/Projects">Projects</a>
                    <a href="/tickets">Tickets</a>
                  </div>
                )}
                {/* <a href="/Bugs">Schedule</a> */}
              </div>

              <div className="flex-column gap-lg">
                {user.role === "Admin" && (
                  <>
                    <a href="/manageusers">Manage Users</a>
                    <a href="/createproject">Create Project</a>
                  </>
                )}

                {user.role === "Project Manager" && (
                  <a href="/createproject">Create Project</a>
                )}

                <a href="/createticket">Create Ticket</a>
              </div>

              <div className="flex-column gap-lg">
                {/* <a href="/Profile">My Profile</a> */}
                {/* <a href="/Chat">Chats</a> */}
                <div className="p-md-hz">
                  <label className="switch">
                    <input type="checkbox" aria-label="Change Color Theme" />
                    <span className="slider round" onClick={changeTheme}></span>
                  </label>
                </div>

                <span onClick={logOut}>
                  <p className="primary a">Log Out</p>
                </span>
              </div>
            </div>
          </nav>
        )}

        {messageInfo.display && (
          <>
            <div className="noti">
              <button className="button-primary" onClick={handleAlertClose}>
                Close
              </button>
              <div className="only-60-width text-align">
                <p> {messageInfo.message}</p>
              </div>
            </div>
          </>
        )}

        <div className="right flex-column">
          <Outlet />
        </div>
      </div>

      {/* Mobile */}
      <div className="mobile" id="mobile-display">
        {user && (
          <>
            {mobile ? (
              <>
                <nav className="mobile-nav" >
                  {user && (
                    <>
                      <div className="flex-column space-around aic jcc full-height full-width">
                        <button
                          className="button-ghost"
                          onClick={() => setMobileOpen(false)}
                        >
                          Close
                        </button>
                        <a href="/">Home</a>

                        {user.role === "Admin" && (
                          <>
                            <a href="/Projects">Projects</a>
                            <a href="/Tickets">Tickets</a>
                            <a href="/createproject">Create Project</a>
                            <a href="/manageusers">Manage Users</a>
                          </>
                        )}
                        <a href="/createticket">Create Ticket</a>

                        {/* <a href="/Chat">Chats</a> */}

                        <label className="switch">
                          <input
                            type="checkbox"
                            aria-label="Change Color Theme"
                          />
                          <span
                            className="slider round"
                            onClick={changeTheme}
                          ></span>
                        </label>
                        {/* <a href="/Profile">My Profile</a> */}
                        <span onClick={logOut}>
                          <p className="primary a">Log Out</p>
                        </span>
                      </div>
                    </>
                  )}
                </nav>
              </>
            ) : (
              <div className="open-mobile-nav">
                <span onClick={handleMobileOpen}>
                  <Hamburger />
                </span>
              </div>
            )}
          </>
        )}
        <div className="bottom full-height">
          <Outlet />
          {messageInfo.open && (
            <>
              <div className="noti ">
                <button className="button-primary" onClick={handleAlertClose}>
                  Close
                </button>
                <div className="only-60-width text-align">
                  <p> {messageInfo.text}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
