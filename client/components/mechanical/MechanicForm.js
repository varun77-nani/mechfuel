import { TextField, Typography, Box } from '@mui/material';

export default function MechanicForm({ vehicleDetails, onDetailsChange }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Vehicle Information
      </Typography>
      <TextField
        fullWidth
        label="Vehicle Make"
        value={vehicleDetails.make}
        onChange={(e) => onDetailsChange('make', e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Vehicle Model"
        value={vehicleDetails.model}
        onChange={(e) => onDetailsChange('model', e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Year"
        value={vehicleDetails.year}
        onChange={(e) => onDetailsChange('year', e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="License Plate"
        value={vehicleDetails.plate}
        onChange={(e) => onDetailsChange('plate', e.target.value)}
      />
    </Box>
  );
}