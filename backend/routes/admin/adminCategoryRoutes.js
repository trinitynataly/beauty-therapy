/*
Version: 1.0
Routes for managing categories within the admin dashboard.
Only accessible to admin-enabled users.
Last Edited by: Natalia Pakhomova
Last Edit Date: 16/10/2024
*/

const express = require('express');
const multer = require('multer');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/admin/adminCategoryController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Define the routes for admin category management
router.get('/', getAllCategories); // GET /api/admin/categories - Get a list of all categories
router.post('/', upload.single('image'), createCategory); // POST /api/admin/categories - Create a new category
router.put('/:id', upload.single('image'), updateCategory); // PUT /api/admin/categories/:id - Update a category by ID
router.delete('/:id', deleteCategory); // DELETE /api/admin/categories/:id - Delete a category by ID

module.exports = router;