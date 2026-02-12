import { Card, CardContent, Typography, Radio, FormControlLabel } from '@mui/material';
import { LocalGasStation } from '@mui/icons-material';

export default function FuelTypeCard({ type, selected, onChange }) {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        border: selected ? '2px solid #1976d2' : '2px solid transparent',
        transition: 'all 0.3s ease'
      }}
      onClick={() => onChange(type)}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          value={type}
          control={<Radio checked={selected} />}
          label={
            <Typography variant="h6" sx={{ ml: 1 }}>
              <LocalGasStation sx={{ verticalAlign: 'middle', mr: 1 }} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Typography>
          }
          sx={{ flexGrow: 1 }}
        />
      </CardContent>
    </Card>
  );
}