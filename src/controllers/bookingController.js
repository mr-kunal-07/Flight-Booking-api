const { Booking, Passenger, Flight, User } = require('../models');
const { sequelize } = require('../config/database');

// Generate booking reference
const generateBookingReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 10; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
};

// Create Booking
exports.createBooking = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { flightId, passengers } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!flightId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
            throw new Error('Invalid booking data');
        }

        // Validate passenger data
        for (const p of passengers) {
            if (!p.firstName || !p.lastName || !p.age || !p.gender) {
                throw new Error('Missing passenger information');
            }
        }

        const flight = await Flight.findByPk(flightId, { transaction });
        if (!flight) {
            throw new Error('Flight not found');
        }

        if (flight.availableSeats < passengers.length) {
            throw new Error('Not enough seats available');
        }

        const totalAmount = Number(flight.price) * passengers.length;

        const booking = await Booking.create({
            userId,
            flightId,
            bookingReference: generateBookingReference(),
            totalAmount,
            numberOfPassengers: passengers.length,
            status: 'CONFIRMED'
        }, { transaction });

        // Prepare passenger records with proper validation
        const passengerRecords = passengers.map(p => ({
            bookingId: booking.id,
            firstName: p.firstName.trim(),
            lastName: p.lastName.trim(),
            age: parseInt(p.age),
            gender: p.gender.toUpperCase().trim()
        }));

        // Bulk create passengers with proper options
        await Passenger.bulkCreate(passengerRecords, {
            transaction,
            validate: true,
            returning: true
        });

        // Update available seats
        await flight.update({
            availableSeats: flight.availableSeats - passengers.length
        }, { transaction });

        await transaction.commit();

        // Fetch complete booking with associations
        const completeBooking = await Booking.findByPk(booking.id, {
            include: [
                { model: Flight, as: 'flight' },
                { model: Passenger, as: 'passengers' }
            ]
        });

        return res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: completeBooking
        });

    } catch (error) {
        await transaction.rollback();

        // Better error handling with specific messages
        let statusCode = 500;
        let message = error.message;

        if (error.message.includes('not found') || error.message.includes('Invalid')) {
            statusCode = 400;
        } else if (error.message.includes('Not enough seats')) {
            statusCode = 409;
        }

        return res.status(statusCode).json({
            success: false,
            message: message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};


// Get Booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByPk(id, {
            include: [
                { model: Flight, as: 'flight' },
                { model: Passenger, as: 'passengers' },
                { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user
        if (booking.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                { model: Flight, as: 'flight' },
                { model: Passenger, as: 'passengers' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};