import { useState, useEffect } from 'react'; // Remove unused 'useContext'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  Grid
} from '@mui/material';
import { 
  CheckCircle, 
  Payment, 
  LocalShipping,
  Security 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mechApi } from '../../utils/api';

const steps = ['Service Details', 'Payment Method', 'Confirmation'];

export default function ServiceCheckout() {
  const { isAuthenticated } = useAuth(); // Remove unused 'user'
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [serviceRequest, setServiceRequest] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Get service request data from navigation state
  useEffect(() => {
    if (location.state?.serviceRequest) {
      setServiceRequest(location.state.serviceRequest);
    } else {
      // Redirect back if no service request data
      navigate('/mechanical');
    }
  }, [location, navigate]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCardDetailChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingAddressChange = (field, value) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitPayment = async () => {
    if (!isAuthenticated) {
      showSnackbar('Please login to complete payment', 'error');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // In a real app, you would process payment through a payment gateway
      // For now, we'll simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Submit the service request to backend
      const response = await mechApi.createRequest(serviceRequest);

      if (response.success) {
        showSnackbar('Payment successful! Service request submitted.');
        
        // Redirect to order confirmation or dashboard
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              message: 'Service request placed successfully!',
              orderId: response.data.service._id
            }
          });
        }, 2000);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      showSnackbar(error.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!serviceRequest?.services) return 0;
    
    const SERVICE_PRICES = {
      'battery_jumpstart': 2075,
      'tire_change': 3320,
      'lockout_service': 2490,
      'tow_service': 6225,
      'fuel_delivery': 1245,
      'engine_repair': 8300,
      'other': 4150
    };

    return serviceRequest.services.reduce((total, serviceId) => {
      return total + (SERVICE_PRICES[serviceId] || 0);
    }, 0);
  };

  const totalAmount = calculateTotal();

  // Format service names for display
  const formatServiceName = (serviceId) => {
    const nameMap = {
      'battery_jumpstart': 'Battery Jumpstart',
      'tire_change': 'Tire Change',
      'lockout_service': 'Lockout Service',
      'tow_service': 'Tow Service',
      'fuel_delivery': 'Fuel Delivery',
      'engine_repair': 'Engine Repair',
      'other': 'Other Service'
    };
    return nameMap[serviceId] || serviceId;
  };

  if (!serviceRequest) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">No service request data found</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/mechanical')}
        >
          Back to Services
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mt: 4 }}>
            {/* Step 1: Service Details */}
            {activeStep === 0 && (
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShipping sx={{ mr: 1 }} /> Service Details
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Selected Services</Typography>
                    {serviceRequest.services.map(serviceId => (
                      <Box key={serviceId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{formatServiceName(serviceId)}</Typography>
                        <Typography fontWeight="bold">
                          ₹{SERVICE_PRICES[serviceId]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                    <Typography><strong>Make:</strong> {serviceRequest.vehicleDetails.make}</Typography>
                    <Typography><strong>Model:</strong> {serviceRequest.vehicleDetails.model}</Typography>
                    {serviceRequest.vehicleDetails.year && (
                      <Typography><strong>Year:</strong> {serviceRequest.vehicleDetails.year}</Typography>
                    )}
                    {serviceRequest.vehicleDetails.licensePlate && (
                      <Typography><strong>License Plate:</strong> {serviceRequest.vehicleDetails.licensePlate}</Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Service Location</Typography>
                    <Typography>{serviceRequest.location.address}</Typography>
                    {serviceRequest.location.coordinates && (
                      <Typography variant="body2" color="text.secondary">
                        Coordinates: {serviceRequest.location.coordinates.lat.toFixed(4)}, {serviceRequest.location.coordinates.lng.toFixed(4)}
                      </Typography>
                    )}
                  </Box>

                  {serviceRequest.problemDescription && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Problem Description</Typography>
                        <Typography>{serviceRequest.problemDescription}</Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 1 && (
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Payment sx={{ mr: 1 }} /> Payment Method
                  </Typography>

                  <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="card">Credit/Debit Card</MenuItem>
                      <MenuItem value="paypal">PayPal</MenuItem>
                      <MenuItem value="cash">Cash on Delivery</MenuItem>
                    </Select>
                  </FormControl>

                  {paymentMethod === 'card' && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>Card Details</Typography>
                      <TextField
                        fullWidth
                        label="Card Number"
                        value={cardDetails.number}
                        onChange={(e) => handleCardDetailChange('number', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardDetailChange('expiry', e.target.value)}
                          placeholder="MM/YY"
                        />
                        <TextField
                          fullWidth
                          label="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                          placeholder="123"
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) => handleCardDetailChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </Box>
                  )}

                  {paymentMethod === 'paypal' && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                      You will be redirected to PayPal to complete your payment.
                    </Alert>
                  )}

                  {paymentMethod === 'cash' && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                      Please have cash ready when the service provider arrives.
                    </Alert>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Billing Address</Typography>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      value={billingAddress.line1}
                      onChange={(e) => handleBillingAddressChange('line1', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Address Line 2 (Optional)"
                      value={billingAddress.line2}
                      onChange={(e) => handleBillingAddressChange('line2', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="City"
                        value={billingAddress.city}
                        onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="State"
                        value={billingAddress.state}
                        onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={billingAddress.zipCode}
                      onChange={(e) => handleBillingAddressChange('zipCode', e.target.value)}
                    />
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 2 && (
              <Card>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom color="success.main">
                    Ready to Complete!
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Review your service request before submitting
                  </Typography>

                  <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'left' }}>
                    <Typography variant="h6" gutterBottom>Order Summary</Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Services:</Typography>
                      <Typography>
                        {serviceRequest.services.map(formatServiceName).join(', ')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Vehicle:</Typography>
                      <Typography>
                        {serviceRequest.vehicleDetails.make} {serviceRequest.vehicleDetails.model}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Location:</Typography>
                      <Typography>{serviceRequest.location.address}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Payment Method:</Typography>
                      <Typography textTransform="capitalize">
                        {paymentMethod === 'card' ? 'Credit Card' : paymentMethod}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6" color="primary">
                        ₹{totalAmount}
                      </Typography>
                    </Box>
                  </Paper>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <Security sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="body2" color="success.main">
                      Your payment is secure and encrypted
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
              size="large"
            >
              Back
            </Button>
            <Button
              onClick={activeStep === steps.length - 1 ? handleSubmitPayment : handleNext}
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={activeStep === steps.length - 1 ? <Payment /> : null}
            >
              {loading ? 'Processing...' : 
               activeStep === steps.length - 1 ? 'Complete Payment' : 'Continue'}
            </Button>
          </Box>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 100 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {serviceRequest.services.map(serviceId => (
                <Box key={serviceId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{formatServiceName(serviceId)}</Typography>
                  <Typography variant="body2">₹{SERVICE_PRICES[serviceId]}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{totalAmount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Service Fee</Typography>
                <Typography>₹0.00</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax</Typography>
                <Typography>₹0.00</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ₹{totalAmount}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Payment will be processed after service completion
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

// Service prices in INR (should match backend)
const SERVICE_PRICES = {
  'battery_jumpstart': 2075,
  'tire_change': 3320,
  'lockout_service': 2490,
  'tow_service': 6225,
  'fuel_delivery': 1245,
  'engine_repair': 8300,
  'other': 4150
};