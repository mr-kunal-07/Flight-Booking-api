const User = require('./User.model');
const Flight = require('./Flight.model');
const Booking = require('./Booking.model');
const Passenger = require('./Passenger.model');

// User-Booking Relationship
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Flight-Booking Relationship
Flight.hasMany(Booking, { foreignKey: 'flightId', as: 'bookings' });
Booking.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' });

// Booking-Passenger Relationship
Booking.hasMany(Passenger, { foreignKey: 'bookingId', as: 'passengers' });
Passenger.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

module.exports = {
    User,
    Flight,
    Booking,
    Passenger
};