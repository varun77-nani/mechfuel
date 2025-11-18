const mongoose = require('mongoose');

const mechanicalServiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    services: [{
        type: String,
        enum: [
            'battery_jumpstart', 
            'tire_change', 
            'lockout_service', 
            'tow_service', 
            'fuel_delivery', 
            'engine_repair',
            'other'
        ],
        required: true
    }],
    vehicleDetails: {
        make: String,
        model: String,
        year: {
            type: Number,
            min: 1900,
            max: new Date().getFullYear() + 1
        },
        licensePlate: String
    },
    location: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        }
    },
    problemDescription: {
        type: String,
        maxlength: 1000
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    assignedMechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    estimatedCompletionTime: Date,
    images: [String] // URLs to uploaded images
}, {
    timestamps: true
});

// Geospatial index for location-based queries
mechanicalServiceSchema.index({ 'location.coordinates': '2dsphere' });
mechanicalServiceSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MechanicalService', mechanicalServiceSchema);