import { Card, CardContent, Typography, Checkbox, FormControlLabel } from '@mui/material';

const services = [
  { id: 1, name: 'Battery Jumpstart', icon: '🔋' },
  { id: 2, name: 'Tire Change', icon: '🛞' },
  { id: 3, name: 'Lockout Service', icon: '🔐' },
  { id: 4, name: 'Tow Service', icon: '🚛' },
];

export default function ServiceCard({ selectedServices, onServiceToggle }) {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Select Required Services
        </Typography>
        {services.map((service) => (
          <FormControlLabel
            key={service.id}
            control={
              <Checkbox
                checked={selectedServices.includes(service.id)}
                onChange={() => onServiceToggle(service.id)}
              />
            }
            label={
              <Typography>
                {service.icon} {service.name}
              </Typography>
            }
            sx={{ display: 'block', ml: 0 }}
          />
        ))}
      </CardContent>
    </Card>
  );
}