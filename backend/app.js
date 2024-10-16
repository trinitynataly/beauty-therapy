/*
Version: 1.4
Main application file for initializing and configuring the Express server.
Last edited by: Natalia Pakhomova
Last edit date: 17/10/2024
*/

// Import the Express library
const express = require('express');
// Import the CORS library
const cors = require('cors');
// Import dotenv for environment variable management
const dotenv = require('dotenv');
// Import Helmet for securing HTTP headers
const helmet = require('helmet');
// Import the function to initialize Firebase
const { initializeFirebase } = require('./config/firebase');

// Load environment variables from .env file, if it exists
dotenv.config();

// Initialize Firebase
initializeFirebase();

// Import the routes configuration file
const router = require('./routes/routes');

// Read the SERVER_NAME environment variable or use 'localhost' as the default
const SERVER_NAME = process.env.SERVER_NAME || 'localhost';

// Define CORS options
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Allow the frontend to send requests to the server
  credentials: true, // Enable credentials (cookies, authorization headers)
};

// Create an Express application
const app = express();
// Use Helmet to help secure the application by setting various HTTP headers
app.use(helmet());
// Use CORS with the previously defined options
app.use(cors(corsOptions));
// Use middleware to parse JSON requests
app.use(express.json());

// Use the main router for all /api endpoints
app.use('/api', router);

// Define a simple route for the root URL
app.get('/', (req, res) => {
  // Send a response with the server name
  res.send(`Server is running on ${SERVER_NAME}`); 
});

// Export the app for use in server.js
module.exports = app;
