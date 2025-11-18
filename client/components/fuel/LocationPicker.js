import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { TextField, Box, Typography, Paper } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
// Remove unused import: iconShadow is not used

let DefaultIcon = L.divIcon({
  html: `<img src="${icon}" style="width: 25px; height: 41px;" />`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      onLocationSelect({
        coordinates: { lat, lng },
        address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
      });
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({ onLocationSelect, selectedLocation }) {
  const [address, setAddress] = useState(selectedLocation?.address || '');
  
  const defaultCenter = [12.9716, 77.5946]; // Default to Bangalore

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    // Optional: You can add forward geocoding here
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        Click on the map to select your location
      </Typography>
      
      <TextField
        fullWidth
        label="Address (Optional)"
        value={address}
        onChange={handleAddressChange}
        InputProps={{
          startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
        }}
        sx={{ mb: 2 }}
        placeholder="Enter your address or click on the map"
      />

      <Paper elevation={3} sx={{ height: 400, width: '100%', overflow: 'hidden' }}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={(location) => {
            onLocationSelect(location);
            setAddress(location.address);
          }} />
        </MapContainer>
      </Paper>
      
      {selectedLocation?.coordinates && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected: {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
        </Typography>
      )}
    </Box>
  );
}