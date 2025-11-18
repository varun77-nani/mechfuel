// Common validation utilities
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone);
};

const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

const isValidCoordinate = (lat, lng) => {
    return (
        typeof lat === 'number' && lat >= -90 && lat <= 90 &&
        typeof lng === 'number' && lng >= -180 && lng <= 180
    );
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidObjectId,
    isValidCoordinate,
    sanitizeInput
};