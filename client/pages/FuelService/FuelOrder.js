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
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { LocalGasStation, CheckCircle } from '@mui/icons-material';
import LocationPicker from '../../components/fuel/LocationPicker'; // ✅ Make sure the path matches your folder structure
import { fuelApi } from '../../utils/api';

const steps = ['Select Fuel Type', 'Enter Location', 'Confirm Order'];

export default function FuelOrder() {
  const [activeStep, setActiveStep] = useState(0);
  const [fuelType, setFuelType] = useState('petrol');
  // location is now an object: { address: string, coordinates: { lat, lng } }
  const [location, setLocation] = useState({ address: '', coordinates: null });
  const [quantity, setQuantity] = useState(5);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState(3.5);
  const [error, setError] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPrice = (type) => {
    const prices = {
      petrol: 108.45,
      diesel: 95.70
    };
    setPricePerLiter(prices[type]);
  };

  const handleNext = () => {
    if (activeStep === 0) fetchPrice(fuelType);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // replaced axios call with fuelApi.createOrder
  const handleSubmitOrder = async () => {
    setError(null);
    setSubmitting(true);

    try {
      // prepare payload to match backend expectations
      const payload = {
        fuelType, // "petrol" | "diesel"
        quantity: Number(quantity),
        location: {
          address: location?.address || '',
          coordinates: location?.coordinates || null
        },
        deliveryNotes,
        totalPrice: Number(quantity) * pricePerLiter
      };

      await fuelApi.createOrder(payload);

      setOrderSubmitted(true);
      // optionally reset steps or form here
      setActiveStep(0);
      setFuelType('petrol');
      setLocation({ address: '', coordinates: null });
      setQuantity(5);
      setDeliveryNotes('');
    } catch (err) {
      // fuelApi throws Error with message from apiRequest
      setError(err.message || 'Failed to submit order.');
    } finally {
      setSubmitting(false);
    }
  };

  // UI
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={orderSubmitted} autoHideDuration={4000} onClose={() => setOrderSubmitted(false)}>
        <Alert severity="success" onClose={() => setOrderSubmitted(false)}>
          Order successfully submitted!
        </Alert>
      </Snackbar>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 6 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Select Your Fuel Type
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['petrol', 'diesel'].map((type) => (
                <Card
                  key={type}
                  onClick={() => {
                    setFuelType(type);
                    fetchPrice(type);
                  }}
                  sx={{
                    cursor: 'pointer',
                    border: fuelType === type ? '2px solid #1976d2' : '1px solid #ddd',
                    bgcolor: fuelType === type ? '#f0f7ff' : '#fff'
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalGasStation sx={{ mr: 2 }} />
                    <Typography variant="h6">{type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Where Do You Need Fuel?
            </Typography>

            {/* LocationPicker should produce { address, coordinates } */}
            <LocationPicker value={location} onChange={setLocation} />

            <TextField
              fullWidth
              label="Quantity (Liters)"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              sx={{ mt: 3, mb: 3 }}
              error={quantity <= 0}
              helperText={quantity <= 0 && 'Quantity must be greater than 0'}
            />
            <TextField
              fullWidth
              label="Delivery Notes (Optional)"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              multiline
              rows={3}
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <CheckCircle color="success" sx={{ mr: 1 }} /> Confirm Your Order
            </Typography>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Fuel Type:</Typography>
                  <Typography fontWeight="bold">{fuelType}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Quantity:</Typography>
                  <Typography fontWeight="bold">{quantity} liters</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Location:</Typography>
                  <Typography fontWeight="bold">{location?.address || '—'}</Typography>
                </Box>
                {deliveryNotes && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Delivery Notes:</Typography>
                    <Typography fontWeight="bold">{deliveryNotes}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Estimated Total:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{(Number(quantity) * pricePerLiter).toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Typography variant="body2" color="text.secondary">
              By placing this order, you agree to our terms of service.
            </Typography>
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
            onClick={activeStep === steps.length - 1 ? handleSubmitOrder : handleNext}
            variant="contained"
            size="large"
            disabled={
              // disable Next/Place Order when invalid
              (activeStep === 1 && (!location || !location.address || quantity <= 0)) ||
              submitting
            }
          >
            {activeStep === steps.length - 1 ? (submitting ? 'Placing...' : 'Place Order') : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
