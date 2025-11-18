const express = require('express');
const authRoutes = require('./authRoutes');
const fuelOrderRoutes = require('./fuelOrderRoutes');
const mechanicalServiceRoutes = require('./mechanicalServiceRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/fuel-orders', fuelOrderRoutes);
router.use('/mechanical-services', mechanicalServiceRoutes);
router.use('/users', userRoutes);

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Mech-Fuel API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/auth',
            fuelOrders: '/api/fuel-orders',
            mechanicalServices: '/api/mechanical-services',
            users: '/api/users'
        }
    });
});

module.exports = router;