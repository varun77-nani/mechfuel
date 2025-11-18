// Application constants
module.exports = {
    // Order statuses
    FUEL_ORDER_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        DISPATCHED: 'dispatched',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    },
    
    SERVICE_STATUS: {
        PENDING: 'pending',
        ASSIGNED: 'assigned',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },
    
    // User roles
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin',
        SERVICE_PROVIDER: 'service_provider'
    },
    
    // Fuel types
    FUEL_TYPES: {
        PETROL: 'petrol',
        DIESEL: 'diesel'
    },
    
    // Service types with prices
    SERVICE_TYPES: {
        BATTERY_JUMPSTART: 'battery_jumpstart',
        TIRE_CHANGE: 'tire_change',
        LOCKOUT_SERVICE: 'lockout_service',
        TOW_SERVICE: 'tow_service',
        FUEL_DELIVERY: 'fuel_delivery',
        ENGINE_REPAIR: 'engine_repair',
        OTHER: 'other'
    },
    
    SERVICE_PRICES: {
        'battery_jumpstart': 25,
        'tire_change': 40,
        'lockout_service': 30,
        'tow_service': 75,
        'fuel_delivery': 15,
        'engine_repair': 100,
        'other': 50
    },
    
    // Fuel prices (per liter)
    FUEL_PRICES: {
        'petrol': 3.5,
        'diesel': 3.2
    },
    
    // Pagination
    PAGINATION: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    },
    
    // File upload
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        MAX_FILES: 5,
        ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
};