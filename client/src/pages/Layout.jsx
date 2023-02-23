import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AdbIcon from "@mui/icons-material/Adb";
import Box from "@mui/material/Box";
import MuiAlert from "@mui/material/Alert";
import { useUserAuth } from "../context/userAuthContext";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import GroupIcon from "@mui/icons-material/Group";
import PestControlIcon from "@mui/icons-material/PestControl";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { clearMessage, setMessage } from "../redux/actions/messageActions";
import { removeSelectedUser } from "../redux/actions/userActions";
//home was excluded from list

const pages = [
  // { name: "Home", icon: <HomeIcon />, link: "/" },
  { name: "Projects", icon: <FormatListBulletedIcon />, link: "/Projects" },
  { name: "Bugs", icon: <PestControlIcon />, link: "/Bugs" },
  { name: "Users", icon: <GroupIcon />, link: "/Users" },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const { user, logOut } = useUserAuth();
  const messageInfo = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearMessage());
  };

  const handleClick = (e) => {
    //set open to show dropdown
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToProfile = () => {
    handleClose();
    navigate(`/users/${currentUser._id}`);
  };

  const signOut = async () => {
    try {
      await logOut();
      dispatch(removeSelectedUser());
      dispatch(setMessage(`You have successfully signed out!`));
      handleClose();
      navigate("/signin");
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <>
      {user && (
        <Box sx={{ display: "flex" }}>
          <AppBar>
            <Toolbar
              sx={{
                alignContent: "center",
                justifyContent: "space-around",
              }}
            >
              <Link to="/">
                <AdbIcon
                  sx={{
                    display: "flex",
                    color: "white",
                    mr: 1,
                  }}
                />
              </Link>

              {pages.map((page) => (
                <Link to={`/${page.name}`} key={page.name}>
                  <Button sx={{ my: 2, color: "white", display: "block" }}>
                    {page.name}
                  </Button>
                </Link>
              ))}

              {!user && (
                <Link to="/SignIn">
                  <Button sx={{ my: 2, color: "white", display: "flex" }}>
                    Sign In
                  </Button>
                </Link>
              )}

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {user && (
                  <>
                    <Button
                      onClick={handleClick}
                      sx={{ my: 2, color: "white", display: "flex" }}
                    >
                      <Avatar alt={user.displayName} src={user.photoURL} />
                    </Button>
                    <Menu
                      id="basic-menu"
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                      <MenuItem onClick={signOut}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            </Toolbar>
          </AppBar>
        </Box>

        //sidebar for devices with xs width
      )}

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

      <Outlet />
    </>
  );
};

export default Navbar;
