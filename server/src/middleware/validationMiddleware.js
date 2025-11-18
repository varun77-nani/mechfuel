const { validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }
    
    next();
};

// Custom validators
const validateObjectId = (value) => {
    return /^[0-9a-fA-F]{24}$/.test(value);
};

const validateCoordinates = (lat, lng) => {
    return (
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180
    );
};

module.exports = {
    handleValidationErrors,
    validateObjectId,
    validateCoordinates
};