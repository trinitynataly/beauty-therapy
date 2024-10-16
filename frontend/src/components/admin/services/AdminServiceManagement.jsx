/*
Version: 1.0
Admin service management component.
Last Edited by: Natalia Pakhomova
Last Edit Date: 17/10/2024
*/

import { useState, useEffect } from 'react'; // Import useState and useEffect from React
import ServiceList from './ServiceList'; // Import ServiceList component
import ServiceForm from './ServiceForm'; // Import ServiceForm component
import { apiSecureRequest } from '../../../utils/auth'; // Import the apiSecureRequest function

/**
 * Admin service management component to manage services.
 * @returns {JSX.Element} - The AdminServiceManagement component
 */
const AdminServiceManagement = () => {
  const [services, setServices] = useState([]); // List of services
  const [categories, setCategories] = useState([]); // List of categories
  const [selectedService, setSelectedService] = useState(null); // Service selected for editing
  const [isCreating, setIsCreating] = useState(false); // Flag for toggling create form

  // Function to fetch services from API
  const fetchServices = async () => {
    try {
      const response = await apiSecureRequest('admin/services', 'GET');
      setServices(response);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  // Function to fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await apiSecureRequest('admin/categories', 'GET');
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Load services and categories on component mount
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  // Function to handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedService) {
        await apiSecureRequest(`admin/services/${selectedService.id}`, 'PUT', formData, true);
      } else {
        await apiSecureRequest('admin/services', 'POST', formData, true);
      }
      fetchServices();
      setSelectedService(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  // Function to handle service deletion
  const handleDeleteService = async (id) => {
    try {
      await apiSecureRequest(`admin/services/${id}`, 'DELETE');
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  return (
    <>
      {/* Service List */}
      <ServiceList services={services} onEditService={setSelectedService} onDeleteService={handleDeleteService} />

      {/* Create/Edit Service Form */}
      {selectedService || isCreating ? (
        <ServiceForm
          service={selectedService}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setSelectedService(null);
            setIsCreating(false);
          }}
        />
      ) : (
        <button
          className="mt-4 bg-primary text-white px-4 py-2 rounded"
          onClick={() => setIsCreating(true)}
        >
          Create New Service
        </button>
      )}
    </>
  );
};

export default AdminServiceManagement;
