/*
Version: 1.1
Routes for managing users within the admin dashboard.
Only accessible to admin-enabled users.
Last Edited by: Natalia Pakhomova
Last Edit Date: 05/11/2024
*/

// Import the Express framework
const express = require('express');
// Import the admin user controller functions
const {
  getAllUsers, // Get all users
  createUser, // Create a new user
  updateUser, // Update a user by email
  deleteUser, // Delete a user by email
} = require('../../controllers/admin/adminUserController');

// Create a new Express router
const router = express.Router();

// Define the routes for admin user management
router.get('/', getAllUsers); // GET /api/admin/users - Get a list of all users
router.post('/', createUser); // POST /api/admin/users - Create a new user
router.put('/:email', updateUser); // PUT /api/admin/users/:email - Update a user by email
router.delete('/:email', deleteUser); // DELETE /api/admin/users/:email - Delete a user by email

// Export the router
module.exports = router;
