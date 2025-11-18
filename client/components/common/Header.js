import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { LocalGasStation, Handyman } from '@mui/icons-material';

export default function Header() {
  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Mech-Fuel
            </Link>
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/fuel"
            startIcon={<LocalGasStation />}
          >
            Fuel
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/mechanical"
            startIcon={<Handyman />}
          >
            Mechanical
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
          >
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}