const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Flight = sequelize.define('Flight', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    airline: {
        type: DataTypes.STRING,
        allowNull: false
    },
    airlineLogo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER, // in minutes
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 180
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 180
    }
}, {
    tableName: 'flights',
    timestamps: true,
    indexes: [
        { fields: ['origin'] },
        { fields: ['destination'] },
        { fields: ['departureTime'] },
        { fields: ['origin', 'destination', 'departureTime'] }
    ]
});

module.exports = Flight;