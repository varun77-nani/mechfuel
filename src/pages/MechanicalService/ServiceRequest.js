import { useState } from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Container, 
  Typography, 
  Box,
  TextField,
  Card,
  CardContent,
  Checkbox,
  Divider, // Remove unused FormControlLabel
  Snackbar,
  Alert
} from '@mui/material';
import { CheckCircle, Handyman } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Remove unused mechApi import
import LocationPicker from '../../components/fuel/LocationPicker';

const steps = ['Select Services', 'Vehicle Details', 'Location & Confirm'];

// Service options with display names (prices in INR)
const SERVICE_OPTIONS = [
  { id: 'battery_jumpstart', name: 'Battery Jumpstart', price: 2075 },
  { id: 'tire_change', name: 'Tire Change', price: 3320 },
  { id: 'lockout_service', name: 'Lockout Service', price: 2490 },
  { id: 'tow_service', name: 'Tow Service', price: 6225 },
  { id: 'fuel_delivery', name: 'Fuel Delivery', price: 1245 },
  { id: 'engine_repair', name: 'Engine Repair', price: 8300 },
  { id: 'other', name: 'Other Service', price: 4150 }
];

export default function ServiceRequest() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: ''
  });
  const [location, setLocation] = useState({
    address: '',
    coordinates: null
  });
  const [problemDescription, setProblemDescription] = useState('');
  // Remove unused loading state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Last step - submit the request
      handleSubmitRequest();
    } else {
      // Move to next step
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const handleVehicleDetailChange = (field, value) => {
    setVehicleDetails(prev => ({ ...prev, [field]: value }));
  };

  // Calculate total amount
  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = SERVICE_OPTIONS.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleSubmitRequest = () => {
    if (!isAuthenticated) {
      showSnackbar('Please login to request service', 'error');
      navigate('/login');
      return;
    }

    // Instead of directly submitting, navigate to checkout
    const serviceData = {
      services: selectedServices,
      vehicleDetails,
      location,
      problemDescription
    };

    // Navigate to checkout with service data
    navigate('/service-checkout', { 
      state: { serviceRequest: serviceData } 
    });
  };

  // Check if current step is valid
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return selectedServices.length > 0;
      case 1:
        return vehicleDetails.make && vehicleDetails.model;
      case 2:
        return location.coordinates;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 6 }}>
        {/* Step 1: Select Services */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Select Required Services
            </Typography>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Available Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {SERVICE_OPTIONS.map((service) => (
                  <Card 
                    key={service.id}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedServices.includes(service.id) ? '2px solid #1976d2' : '1px solid #ddd',
                      bgcolor: selectedServices.includes(service.id) ? '#f0f7ff' : '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ₹{service.price}
                          </Typography>
                        </Box>
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              
              {selectedServices.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="success.dark">
                    Total: ₹{calculateTotal()}
                  </Typography>
                  <Typography variant="body2" color="success.dark">
                    {selectedServices.length} service(s) selected
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
        )}

        {/* Step 2: Vehicle Details */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Vehicle Information
            </Typography>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Vehicle Make"
                  value={vehicleDetails.make}
                  onChange={(e) => handleVehicleDetailChange('make', e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Vehicle Model"
                  value={vehicleDetails.model}
                  onChange={(e) => handleVehicleDetailChange('model', e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={vehicleDetails.year}
                  onChange={(e) => handleVehicleDetailChange('year', e.target.value)}
                  inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                />
                <TextField
                  fullWidth
                  label="License Plate"
                  value={vehicleDetails.licensePlate}
                  onChange={(e) => handleVehicleDetailChange('licensePlate', e.target.value)}
                />
              </Box>
            </Card>
          </Box>
        )}

        {/* Step 3: Location & Confirmation */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Location & Confirmation
            </Typography>
            
            <LocationPicker 
              onLocationSelect={handleLocationSelect}
              selectedLocation={location}
            />
            
            <TextField
              fullWidth
              label="Problem Description (Optional)"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              multiline
              rows={4}
              sx={{ mt: 3, mb: 3 }}
              placeholder="Describe the issue you're experiencing..."
            />

            {/* Order Summary */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} /> Service Request Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>Selected Services:</Typography>
                {selectedServices.map(serviceId => {
                  const service = SERVICE_OPTIONS.find(s => s.id === serviceId);
                  return (
                    <Box key={serviceId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{service?.name}</Typography>
                      <Typography>₹{service?.price}</Typography>
                    </Box>
                  );
                })}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Vehicle:</Typography>
                  <Typography fontWeight="bold">
                    {vehicleDetails.make} {vehicleDetails.model} {vehicleDetails.year}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Location:</Typography>
                  <Typography fontWeight="bold">{location.address || 'Selected on map'}</Typography>
                </Box>
                
                {problemDescription && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Problem:</Typography>
                    <Typography fontWeight="bold">{problemDescription}</Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total Amount:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{calculateTotal()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            {!isAuthenticated && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please login to submit your service request
              </Alert>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size="large"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            size="large"
            disabled={!isStepValid()}
            startIcon={<Handyman />}
          >
            {activeStep === steps.length - 1 ? 'Proceed to Checkout' : 'Next'}
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}