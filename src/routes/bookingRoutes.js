const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Validation rules
const createBookingValidation = [
    body('flightId').notEmpty().withMessage('Flight ID is required'),
    body('passengers').isArray({ min: 1 }).withMessage('At least one passenger required'),
    body('passengers.*.firstName').notEmpty().withMessage('Passenger first name required'),
    body('passengers.*.lastName').notEmpty().withMessage('Passenger last name required')
];

// All booking routes require authentication
router.use(authMiddleware);

// Routes
router.post('/create', createBookingValidation, validate, bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.get('/user/history', bookingController.getUserBookings);

module.exports = router;