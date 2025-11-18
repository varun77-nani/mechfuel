const FuelOrder = require('../models/FuelOrder');

// Create new fuel order
const createFuelOrder = async (req, res) => {
    try {
        const { fuelType, quantity, location, deliveryNotes } = req.body;
        
        // Calculate total amount
        const pricePerLiter = 3.5; // This could be dynamic based on fuel type
        const totalAmount = quantity * pricePerLiter;

        const fuelOrder = await FuelOrder.create({
            userId: req.user.userId,
            fuelType,
            quantity,
            location,
            deliveryNotes,
            totalAmount
        });

        // Populate user details
        await fuelOrder.populate('userId', 'username email phone');

        res.status(201).json({
            success: true,
            message: 'Fuel order created successfully',
            data: { order: fuelOrder }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Error creating fuel order' 
        });
    }
};

// Get user's fuel orders
const getUserFuelOrders = async (req, res) => {
    try {
        const orders = await FuelOrder.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username email phone');

        res.json({
            success: true,
            data: { orders }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Error fetching fuel orders' 
        });
    }
};

// Get single fuel order
const getFuelOrder = async (req, res) => {
    try {
        const order = await FuelOrder.findOne({
            _id: req.params.id,
            userId: req.user.userId
        }).populate('userId', 'username email phone');

        if (!order) {
            return res.status(404).json({ 
                success: false,
                error: 'Order not found' 
            });
        }

        res.json({
            success: true,
            data: { order }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Error fetching order' 
        });
    }
};

// Update fuel order status
const updateFuelOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await FuelOrder.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { status },
            { new: true }
        ).populate('userId', 'username email phone');

        if (!order) {
            return res.status(404).json({ 
                success: false,
                error: 'Order not found' 
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Error updating order' 
        });
    }
};

module.exports = {
    createFuelOrder,
    getUserFuelOrders,
    getFuelOrder,
    updateFuelOrderStatus
};