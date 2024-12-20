/*
Version: 1.2
Controller for handling public service-related operations.
Allows unauthenticated users to list all published categories with their published services and get a service by its slug.
Last Edited by: Natalia Pakhomova
Last Edit Date: 05/11/2024
*/

// Import the Firestore instance
const admin = require('firebase-admin');
// Create a Firestore client instance
const db = admin.firestore();

/**
 * Get a list of all published categories with their published services.
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {array} - List of categories with services
 */
const getCategoriesWithServices = async (req, res) => {
  try {
    // Get all published categories from the Firestore collection, sorted by sortOrder and then by name
    const categoriesSnapshot = await db.collection('categories')
      .where('isPublished', '==', true) // Only get published categories
      .orderBy('sortOrder') // Sort by sortOrder
      .orderBy('name') // Then sort by name
      .get(); // Get the documents

    // Create an array to store the categories
    const categories = [];

    // Loop through the categories and add each category to the array
    for (const categoryDoc of categoriesSnapshot.docs) {
      // Get the category data
      const categoryData = categoryDoc.data();

      // Get all published services belonging to this category, sorted by name
      const servicesSnapshot = await db.collection('services')
        .where('categoryId', '==', categoryDoc.id) // Only get services for this category
        .where('isPublished', '==', true) // Only get published services
        .orderBy('name') // Sort by name
        .get(); // Get the documents

      // Create an array to store the services for this category
      const services = [];
      // Loop through the services and add each service to the array
      servicesSnapshot.forEach((serviceDoc) => {
        // Get the service data
        const service = serviceDoc.data();
        // Add the service to the array
        services.push({
          id: serviceDoc.id, // Add the service ID
          name: service.name, // Add the service name
          description: service.description, // Add the service description
          price: service.price, // Add the service price
          imageUrl: service.imageUrl, // Add the service image URL
          slug: service.slug, // Add the service slug
        });
      });

      // Add the category along with its services to the categories array
      categories.push({
        id: categoryDoc.id, // Add the category ID
        name: categoryData.name, // Add the category name
        sortOrder: categoryData.sortOrder, // Add the sort order for categories
        services, // Add the services array
      });
    }

    // Send the array of categories with services as the response
    res.json(categories);
  } catch (error) {
    // Catch any errors and send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a service by its slug, ensuring both the service and its category are published.
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The service profile
 */
const getServiceBySlug = async (req, res) => {
  // Get the slug from the request parameters
  const { slug } = req.params;
  try {
    // Get the service by slug from the Firestore collection
    const serviceSnapshot = await db.collection('services').where('slug', '==', slug).where('isPublished', '==', true).get();

    // Return a 404 response if the service is not found or not published
    if (serviceSnapshot.empty) {
      return res.status(404).json({ error: 'Service not found or not published.' });
    }

    // Get the service document from the snapshot
    const serviceDoc = serviceSnapshot.docs[0];
    // Get the service data
    const serviceData = serviceDoc.data();

    // Get the category reference to fetch the category name
    const categoryRef = db.collection('categories').doc(serviceData.categoryId);
    // Get the category document
    const categoryDoc = await categoryRef.get();

    // Return a 404 response if the category is not found or not published
    if (!categoryDoc.exists || !categoryDoc.data().isPublished) {
      return res.status(404).json({ error: 'Service category not found or not published.' });
    }

    // Send the service data as the response
    res.json({
      id: serviceDoc.id, // Add the service ID
      name: serviceData.name, // Add the service name
      description: serviceData.description, // Add the service description
      price: serviceData.price, // Add the service price
      imageUrl: serviceData.imageUrl, // Add the service image URL
      categoryId: serviceData.categoryId, // Add the category ID
      categoryName: categoryDoc.data().name, // Add the category name
    });
  } catch (error) {
    // Catch any errors and send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
};

// Export the controller functions
module.exports = { getCategoriesWithServices, getServiceBySlug };
