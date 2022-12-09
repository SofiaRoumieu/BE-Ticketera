// config.js
const dotenv = require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://roumieusofia:sofia276@cluster0.qlldo8y.mongodb.net/?retryWrites=true&w=majority/',
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'ticketera'
}