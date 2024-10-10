/*
Version: 1.2
Login page for the frontend.
Last Edited by: Natalia Pakhomova
Last Edit Date: 10/09/2024
*/

import { useState } from 'react'; // Import the useState hook
import { useNavigate, Link } from 'react-router-dom'; // Import the useNavigate hook from React Router
import { ApiLogin } from '../api/auth'; // Import the ApiLogin function
import Logo from '../components/layout/Logo'; // Import the Logo component
import useApiErrorHandler from '../hooks/useApiErrorHandler'; // Import the custom hook
import useAuth from '../hooks/useAuth'; // Import the useAuth hook

import { loginFormContainer, inputField, errorMessage, buttonStyle } from '../styles/login.css.ts'; // Import the CSS styles

/**
 * Login page component.
 * @returns {JSX.Element} - The Login page.
*/
const Login = () => {
  const [email, setEmail] = useState(''); // Declare the email state variable
  const [password, setPassword] = useState(''); // Declare the password state variable
  const [error, setError] = useState(''); // Declare the error state variable
  const navigate = useNavigate(); // Get the navigate function from the useNavigate hook
  const { login } = useAuth(); // Get the login function from the useAuth hook

  // Get the error handler from the custom hook
  const handleApiError = useApiErrorHandler();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    try {
      // Call ApiLogin without internal error handling
      const { accessToken, refreshToken } = await ApiLogin(email, password);

      // Check if the access token or refresh token is missing
      if (!accessToken || !refreshToken) {
        // Throw an error if the tokens are missing
        throw new Error('Login failed. Please try again.');
      }

      // Call the login function from the AuthContext
      login(accessToken, refreshToken); 

      // Redirect to the home page after successful login
      navigate('/');
    } catch (err) {
      // Use the custom error handler
      handleApiError(err);
      // Display the error message in the form
      setError(err.message);
    }
  };

  // Return the Login form
  return (
    <div className={`flex justify-center items-center min-h-screen ${loginFormContainer}`}>
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Logo */}
        <Logo variant='large' />
        {/* Title */}
        <h2 className="text-2xl font-bold mt-4 mb-4 text-center">Please Sign In</h2>
        
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border px-3 py-2 rounded ${inputField}`}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border px-3 py-2 rounded ${inputField}`}
          />
        </div>

        {/* Display Error Message */}
        {error && (
          <div className={`text-red-500 mb-4 ${errorMessage}`}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className={`w-full py-2 bg-blue-500 text-white rounded ${buttonStyle}`}>
          Sign In
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Do not have an account? </span>
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </div>
      </form>
      {/* Login Link */}
      
    </div>
  );
};

// Export the Login component
export default Login;
