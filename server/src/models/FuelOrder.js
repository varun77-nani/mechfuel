const mongoose = require('mongoose');

const fuelOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1 liter'],
        max: [100, 'Quantity cannot exceed 100 liters']
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
    deliveryNotes: {
        type: String,
        maxlength: 500
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
        default: 'pending'
    },
    assignedProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    estimatedDeliveryTime: Date
}, {
    timestamps: true
});

// Geospatial index for location-based queries
fuelOrderSchema.index({ 'location.coordinates': '2dsphere' });
fuelOrderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('FuelOrder', fuelOrderSchema);