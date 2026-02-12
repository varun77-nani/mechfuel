import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { apiRequest } from '../../utils/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [fuelOrders, setFuelOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, servicesRes] = await Promise.all([
        apiRequest('/fuel-orders/admin/all', 'GET'),
        apiRequest('/mechanical-services/admin/all', 'GET')
      ]);

      if (ordersRes.success) {
        setFuelOrders(ordersRes.data.orders || []);
      }
      if (servicesRes.success) {
        setServiceRequests(servicesRes.data.services || []);
      }
    } catch (err) {
      setError('Failed to fetch data. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'warning',
      confirmed: 'info',
      dispatched: 'primary',
      delivered: 'success',
      cancelled: 'error',
      assigned: 'info',
      in_progress: 'primary',
      completed: 'success'
    };
    return colorMap[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        📊 Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Fuel Orders
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {fuelOrders.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Service Requests
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
              {serviceRequests.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Orders & Requests
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
              {fuelOrders.length + serviceRequests.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
          <Tab label={`Fuel Orders (${fuelOrders.length})`} />
          <Tab label={`Service Requests (${serviceRequests.length})`} />
        </Tabs>
      </Box>

      {/* Fuel Orders Tab */}
      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fuel Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quantity (L)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fuelOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No fuel orders yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                fuelOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {order._id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {order.userId?.username || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.userId?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.fuelType?.toUpperCase()}
                        size="small"
                        color={order.fuelType === 'petrol' ? 'info' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.location?.address}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                      ₹{order.totalAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status?.toUpperCase()}
                        size="small"
                        color={getStatusColor(order.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Service Requests Tab */}
      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Request ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Services</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Vehicle</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviceRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No service requests yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                serviceRequests.map((service) => (
                  <TableRow key={service._id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {service._id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {service.userId?.username || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {service.userId?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {service.services?.map((svc, idx) => (
                          <Chip
                            key={idx}
                            label={svc.replace('_', ' ')}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {service.vehicleDetails?.make} {service.vehicleDetails?.model}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {service.vehicleDetails?.year}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{service.location?.address}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                      ₹{service.totalAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.status?.toUpperCase()}
                        size="small"
                        color={getStatusColor(service.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
