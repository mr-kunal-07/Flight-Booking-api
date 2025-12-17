const express = require('express');
const { body } = require('express-validator');
const flightController = require('../controllers/flightController');
const validate = require('../middleware/validation');

const router = express.Router();

// Validation rules
const searchValidation = [
    body('origin').notEmpty().withMessage('Origin is required'),
    body('destination').notEmpty().withMessage('Destination is required'),
    body('passengers')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Passengers must be at least 1')
];

// Routes
router.post('/search', searchValidation, validate, flightController.searchFlights);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);

module.exports = router;