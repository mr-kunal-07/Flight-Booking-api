const { Flight } = require('../models');
const { Op } = require('sequelize');

// Search Flights
exports.searchFlights = async (req, res) => {
    try {
        const { origin, destination, travelDate, passengers } = req.body;

        // Build query conditions
        const whereConditions = {
            origin: { [Op.iLike]: `%${origin}%` },
            destination: { [Op.iLike]: `%${destination}%` },
            availableSeats: { [Op.gte]: passengers || 1 }
        };

        // Add date filter if provided
        if (travelDate) {
            const startDate = new Date(travelDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(travelDate);
            endDate.setHours(23, 59, 59, 999);

            whereConditions.departureTime = {
                [Op.between]: [startDate, endDate]
            };
        }

        // Search flights
        const flights = await Flight.findAll({
            where: whereConditions,
            order: [['departureTime', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: flights.length,
            data: flights
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching flights',
            error: error.message
        });
    }
};

// Get Flight by ID
exports.getFlightById = async (req, res) => {
    try {
        const { id } = req.params;

        const flight = await Flight.findByPk(id);

        if (!flight) {
            return res.status(404).json({
                success: false,
                message: 'Flight not found'
            });
        }

        res.status(200).json({
            success: true,
            data: flight
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching flight',
            error: error.message
        });
    }
};

// Get All Flights (with pagination)
exports.getAllFlights = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Flight.findAndCountAll({
            limit,
            offset,
            order: [['departureTime', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching flights',
            error: error.message
        });
    }
};