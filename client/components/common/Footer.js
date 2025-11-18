import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, backgroundColor: '#f5f5f5', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Mech-Fuel Emergency Services. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}