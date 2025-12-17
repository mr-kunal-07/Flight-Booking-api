const Flight = require('../models/Flight.model');
const { sequelize } = require('../config/database');

const airlines = [
    { name: 'Air India', logo: 'https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg' },
    { name: 'IndiGo', logo: 'https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg' },
    { name: 'Vistara', logo: 'https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg' },
    { name: 'AirAsia India', logo: 'https://www.logo.wine/a/logo/AirAsia_India/AirAsia_India-Logo.wine.svg' },
];


const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa'
];

const generateFlights = () => {
    const flights = [];
    let flightCounter = 100;

    // Generate flights for next 7 days
    for (let day = 0; day < 7; day++) {
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + day);

        // Generate 20-30 flights per day
        for (let i = 0; i < 5; i++) {
            const origin = cities[Math.floor(Math.random() * cities.length)];
            let destination = cities[Math.floor(Math.random() * cities.length)];

            // Ensure origin and destination are different
            while (destination === origin) {
                destination = cities[Math.floor(Math.random() * cities.length)];
            }

            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const departureHour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
            const duration = 60 + Math.floor(Math.random() * 180); // 1-4 hours

            const departureTime = new Date(baseDate);
            departureTime.setHours(departureHour, Math.floor(Math.random() * 60), 0, 0);

            const arrivalTime = new Date(departureTime);
            arrivalTime.setMinutes(arrivalTime.getMinutes() + duration);

            flights.push({
                flightNumber: `${airline.name.substring(0, 2).toUpperCase()}${flightCounter++}`,
                airline: airline.name,
                airlineLogo: airline.logo,
                origin: origin,
                destination: destination,
                departureTime,
                arrivalTime,
                duration,
                price: (2000 + Math.floor(Math.random() * 8000)).toFixed(2),
                availableSeats: Math.floor(Math.random() * 50) + 100,
                totalSeats: 180
            });
        }
    }

    return flights;
};


const seedFlights = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Neon Database connected successfully');

        console.log('🗑️ Resetting flights table...');
        await Flight.sync({ force: true });

        console.log('🌱 Generating flight data...');
        const flights = generateFlights();

        console.log(`📝 Seeding ${flights.length} flights...`);
        await Flight.bulkCreate(flights);

        const count = await Flight.count();
        console.log('✅ Flights seeded successfully');
        console.log(`📊 Total flights in database: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding flights:', error.message);
        console.error(error);
        process.exit(1);
    }
};

seedFlights();