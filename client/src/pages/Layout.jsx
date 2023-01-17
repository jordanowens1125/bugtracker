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
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import HomeIcon from '@mui/icons-material/Home';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PestControlIcon from '@mui/icons-material/PestControl';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
//home was excluded from list
const pages = ['Projects', 'Bugs','Users'];
const pages2 = [
  {'name':'Home','icon':<HomeIcon/>,'link':'/'},
  {'name':'Projects','icon':<FormatListBulletedIcon/>,'link':'/Projects'},
  {'name':'Bugs','icon':<PestControlIcon/>,'link':'/Bugs'},
  {'name':'Users','icon':<GroupIcon/>,'link':'/Users'}
]

const SideBar =()=>{
  const result = 
  <>
  {pages2.map((page) => (
    <Link key={page.name} to={page.link} style={{ textDecoration: 'none' }}>
      <ListItem  disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
    </Link>
      
    ))}

  </>
  return(result)
}
const drawerWidth = 200;
const Navbar = () => {
  const [user,loading] = useAuthState(auth)
  return (
    <>
      {/* <Box sx={{ display: 'flex',}}
      bgcolor="Background"     >
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          backgroundColor:'red',
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          <SideBar/>
        </List>
        <Divider />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
      </Box>
    </Box> */}
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