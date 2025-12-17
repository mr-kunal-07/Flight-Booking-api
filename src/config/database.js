const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Neon Database connected successfully');
        console.log(`📍 Database: ${sequelize.config.database}`);

        // For development: Drop and recreate all tables
        // WARNING: This will delete all data!
        if (process.env.NODE_ENV === 'development' && process.env.FORCE_SYNC === 'true') {
            console.log('⚠️  FORCE SYNC: Dropping all tables...');
            await sequelize.sync({ force: true });
            console.log('✅ All tables recreated');
        } else {
            // Normal sync without dropping
            await sequelize.sync({ alter: false });
            console.log('✅ Database synchronized');
        }
    } catch (error) {
        console.error('❌ Neon Database connection failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection test successful');
        return true;
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        return false;
    }
};

module.exports = { sequelize, connectDB, testConnection };