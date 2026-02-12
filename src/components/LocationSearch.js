import React, { useState } from 'react';
import Select from 'react-select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon bug (marker icons)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const LocationSearch = () => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleInputChange = async (inputValue) => {
    if (!inputValue || typeof inputValue !== 'string') return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&countrycodes=in&limit=10`
      );
      const data = await res.json();

      // Filter strictly for Telangana using bounding box
      const telanganaBox = {
        north: 19.5,
        south: 15.5,
        east: 81.5,
        west: 77.0,
      };

      const filtered = data.filter((place) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        return (
          lat <= telanganaBox.north &&
          lat >= telanganaBox.south &&
          lon <= telanganaBox.east &&
          lon >= telanganaBox.west
        );
      });

      const formattedOptions = filtered.map((place) => ({
        label: String(place.display_name || ''),
        value: {
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
          name: String(place.display_name || ''),
        },
      }));

      setOptions(formattedOptions);
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ textAlign: 'center' }}>Search a Location</h3>
      <Select
        options={options}
        onInputChange={(inputValue, { action }) => {
          if (action === 'input-change') {
            handleInputChange(inputValue);
          }
        }}
        onChange={setSelected}
        placeholder="Enter a location..."
        noOptionsMessage={() => "Start typing to search..."}
        getOptionLabel={(e) => e.label?.toString() || ''}
        getOptionValue={(e) => e.label?.toString() || ''}
      />

      {selected && (
        <MapContainer
          center={[selected.value.lat, selected.value.lon]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '400px', width: '100%', marginTop: '1rem' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker position={[selected.value.lat, selected.value.lon]}>
            <Popup>{selected.value.name}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default LocationSearch;
