/*
Version: 1.2
Controller for handling public category-related operations.
Allows unauthenticated users to list all categories.
Last Edited by: Natalia Pakhomova
Last Edit Date: 05/11/2024
*/

// Import the Firestore instance
const admin = require('firebase-admin');
// Create a Firestore client instance
const db = admin.firestore();

/**
 * Get a list of all categories.
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {array} - List of categories
 */
const getAllCategories = async (req, res) => {
  try {
    // Get all published categories from the Firestore collection, sorted by sortOrder and then by name
    const snapshot = await db.collection('categories')
      .where('isPublished', '==', true) // Only get published categories
      .orderBy('sortOrder') // Sort by sortOrder
      .orderBy('name') // Then sort by name
      .get(); // Get the documents

    // Create an array to store the categories
    const categories = [];
    // Loop through the snapshot and add each category to the array
    snapshot.forEach((doc) => {
      const category = doc.data();
      // Add the category to the array
      categories.push({
        id: doc.id, // Add the document ID as the category I
        name: category.name, // Add the category name
        imageUrl: category.imageUrl, // Add the category image URL
      });
    });
    // Send the array of categories as the response
    res.json(categories);
  } catch (error) { // Catch any errors and send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
};

// Export the controller function
module.exports = { getAllCategories };
