const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,    
        });
        console.log(`MongoDB connected ${db.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB connection Failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;