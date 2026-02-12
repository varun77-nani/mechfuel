import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalGasStation, Handyman } from '@mui/icons-material';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Mech-Fuel Emergency Services
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 6 }}>
        Get immediate assistance when you're stranded on the road
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<LocalGasStation />}
          onClick={() => navigate('/fuel')}
          sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
        >
          Fuel Delivery
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<Handyman />}
          onClick={() => navigate('/mechanical')}
          sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
        >
          Mechanical Help
        </Button>
      </Box>
    </Container>
  );
}