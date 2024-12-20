/*
Version: 1.2
Main entry point for the frontend codebase.
Last Edited by: Natalia Pakhomova
Last Edit Date: 05/11/2024
*/

import React from 'react'; // Import React
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider
import App from './App'; // Import the App component
import '@fontsource/open-sans'; // Import the Open Sans font
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import the Font Awesome CSS
import './styles/tailwind.css';  // Import the Tailwind CSS
import './styles/global.css'; // Import the global styles

// Render the App component to the root element
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrap the App component React.StrictMode for additional checks
  <React.StrictMode>
    {/* Wrap the App component with the HelmetProvider for SEO */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
