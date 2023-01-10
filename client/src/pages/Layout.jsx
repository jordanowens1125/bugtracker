import { Outlet, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AdbIcon from '@mui/icons-material/Adb';
import Box from '@mui/material/Box';
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../utils/firebase'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
//home was excluded from list
const pages = ['Projects', 'Bugs','Users'];

const Navbar = () => {
  const [user,loading] = useAuthState(auth)
  return (
    <>
      <AppBar >
      <Container maxWidth="xl">
        <Toolbar >
          <Link to="/">
            <AdbIcon sx={{display:{xs:'none', md:'flex', color:'white'}, mr:1}} />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <Link to="/">
            <Button 
              sx={{ my: 2, color: 'white', display: 'block' }}>
              Home
            </Button>
          </Link>
          {pages.map((page) => (
            <Link to={`/${page}`} key={page}>
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            </Link>
          ))}
          </Box>
          
          <Link to="/">
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none', color:'white'}, mr: 1 }} />
          </Link> 
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Link to="/">
            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}>
              Home
            </Button>
          </Link>
          {pages.map((page) => (
            <Link to={`/${page}`} key={page}>
              <Button key={page} sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            </Link>
            ))}
          {!user &&
            <Link to="/SignIn">
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}>
                Sign In
              </Button>
            </Link>
          }
          {user &&
            <Link to="/">
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}>
                <Avatar alt={user.displayName} src={user.photoURL} />
              </Button>
            </Link>
          }
          </Box> 
        </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  )
};

export default Navbar;