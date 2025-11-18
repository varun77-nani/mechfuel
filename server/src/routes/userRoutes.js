const express = require('express');
const { body } = require('express-validator');
const {
    getDashboardStats,
    updateProfile,
    getOrderHistory
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation rules
const profileValidation = [
    body('phone')
        .optional()
        .matches(/^\+?[\d\s-()]+$/)
        .withMessage('Please enter a valid phone number'),
    
    body('vehicleInfo.make')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Vehicle make cannot exceed 50 characters'),
    
    body('vehicleInfo.model')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Vehicle model cannot exceed 50 characters'),
    
    body('vehicleInfo.year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage('Please enter a valid vehicle year'),
    
    body('vehicleInfo.licensePlate')
        .optional()
        .isLength({ max: 20 })
        .withMessage('License plate cannot exceed 20 characters')
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/dashboard', getDashboardStats);
router.get('/orders', getOrderHistory);
router.patch('/profile', profileValidation, handleValidationErrors, updateProfile);

module.exports = router;