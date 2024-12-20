/*
Version: 1.2
CategoryForm component for editing and creating categories in the admin panel with Joi validation.
Last Edited by: Natalia Pakhomova
Last Edit Date: 05/11/2024
*/

import { useState, useEffect } from 'react'; // Import useState and useEffect from React
import PropTypes from 'prop-types'; // Import PropTypes for defining component prop types
import Joi from 'joi'; // Import Joi for validation

/**
 * CategoryForm component to create and edit categories.
 * @param {Object} category - The category object to edit
 * @param {Function} onSubmit - The function to handle form submission
 * @param {Function} onCancel - The function to handle form cancellation
 * @returns {JSX.Element} - The CategoryForm component
 */
const CategoryForm = ({ category, onSubmit, onCancel }) => {
  // Create state variable for form data
  const [formData, setFormData] = useState({
    name: '', // Category name, default empty
    image: null, // Category image, default null
    sortOrder: 0, // Sort order, default 0
    isPublished: true, // Published status, default true
  });
  // Create state variable for validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Set form data when category changes
  useEffect(() => {
    if (category) {
      // Set FormData with the new values
      setFormData({
        name: category.name, // Set category name
        image: null, // Set category image to null
        sortOrder: category.sortOrder || 0, // Set sort order
        isPublished: category.isPublished ? category.isPublished : false, // Set published status
      });
    } else {
      // Reset form data
      setFormData({
        name: '', // Reset category name to empty
        image: null, // Reset category image to null
        sortOrder: 0, // Reset sort order to 0
        isPublished: true, // Reset published status to true
      });
    }
  }, [category]); // Run when category changes

  // Create a Joi schema for form validation
  const schema = Joi.object({
    // Category name is required
    name: Joi.string().required().messages({
      'string.empty': 'Category name is required.',
    }),
    // Sort order must be a number greater than or equal to 0
    sortOrder: Joi.number().integer().min(0).messages({
      'number.base': 'Sort order must be a number.',
      'number.min': 'Sort order must be 0 or a positive integer.',
    }),
    // Published status is a boolean
    isPublished: Joi.boolean(),
  });

  // Function to validate the form data
  const validate = () => {
    // Extract form data excluding the image field
    const { name, sortOrder, isPublished } = formData;
    // Create an object with the data to validate
    const dataToValidate = { name, sortOrder, isPublished };
    // Validate the data using the schema
    const { error } = schema.validate(dataToValidate, { abortEarly: false });
    // Check if there are any validation errors
    if (!error) return null;

    // Map Joi validation errors to an errors object
    const errors = {};
    // Loop through each error and add it to the errors object
    for (let item of error.details) {
      // Set the error message for the field
      errors[item.path[0]] = item.message;
    }
    // Return the errors object
    return errors;
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    // Get the input field id, value, files, type, and checked status
    const { id, value, files, type, checked } = e.target;
    // Update the form data based on the input type
    setFormData({
      ...formData, // Spread the existing form data
      [id]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value, // Update the field value
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent the default form submission
    e.preventDefault();

    // Validate the form data
    const errors = validate();
    // Set the validation errors
    setValidationErrors(errors || {});
    // Check if there are any errors and return if there are
    console.log(errors);
    if (errors) return;

    // Create a FormData object
    const formDataToSubmit = new FormData();
    // Append the form data to the FormData object
    formDataToSubmit.append('name', formData.name);
    // Append the image to the FormData object
    formDataToSubmit.append('sortOrder', formData.sortOrder);
    // Append the published status to the FormData object
    formDataToSubmit.append('isPublished', formData.isPublished);
    
    // Check if an image is present
    if (formData.image) {
      // Append the image to the FormData object
      formDataToSubmit.append('image', formData.image);
    }

    // Call the onSubmit function with the form data 
    onSubmit(formDataToSubmit);
  };
  
  // Return the CategoryForm component
  return (
    <>
      {/* Category Form Popup */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
        {/* Form Container */}
        <div className="bg-white p-6 shadow-lg rounded w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Form Component */}
          <form onSubmit={handleSubmit}>
            {/* Form Title */}
            <h2 className="text-xl font-bold mb-4">{category ? 'Edit Category' : 'Create New Category'}</h2>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="name">Category Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              {validationErrors.name && <div className="text-red-500">{validationErrors.name}</div>}
            </div>

            {/* Image Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="image">Category Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Sort Order Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="sortOrder">Sort Order</label>
              <input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              {validationErrors.sortOrder && <div className="text-red-500">{validationErrors.sortOrder}</div>}
            </div>

            {/* Published Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="isPublished">Published</label>
              <input
                id="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={handleChange}
                className="mr-2"
              />
              <span>{formData.isPublished ? 'Yes' : 'No'}</span>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-between">
              <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                {category ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Define the prop types for the CategoryForm component
CategoryForm.propTypes = {
  category: PropTypes.object, // Category object
  onSubmit: PropTypes.func.isRequired, // Function to handle form submission 
  onCancel: PropTypes.func.isRequired, // Function to handle form cancellation
};

// Export the CategoryForm component
export default CategoryForm;
