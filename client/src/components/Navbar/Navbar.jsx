import { Outlet, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AdbIcon from '@mui/icons-material/Adb';
const pages = ['Home', 'Projects', 'Bugs','Users'];

const Navbar = () => {

  return (
    <>
      <AppBar>
        <Toolbar >
          <AdbIcon sx={{display:{xs:'none', md:'flex'}, mr:1}} />
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Projects">Projects</Link>
            </li>
            <li>
              <Link to="/Bugs">Bugs</Link>
            </li>
            <li>
              <Link to="/Users">Users</Link>
            </li>
          </ul>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  )
};

export default Navbar;