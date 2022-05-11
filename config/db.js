require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true });

        console.log("Connected to mongoDB");

    } catch (error) {
        console.error("Error to connect to mongoDB!");
        process.exit(1);
    }
}

module.exports = connectDB;