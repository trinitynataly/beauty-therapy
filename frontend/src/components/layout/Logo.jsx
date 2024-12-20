/*
Version: 1.3
Logo component for the frontend.
Last Edited by: Natalia Pakhomova
Last Edit Date: 05/11/2024
*/

import PropTypes from 'prop-types'; // Import the PropTypes library
import { logoVariants, logoTextStyle } from '../../styles/common/logo.css'; // Import the logoVariants and logoTextStyle from the logo.css file

/**
 * Logo component to display the site logo. 
 * @param {variant} - The variant of the logo to display (default or )
 * @returns 
 */
const Logo = ({ variant = 'default' }) => {
  // Return the logo component
  return (
    <>
      {/* Link to the home page and logo variant class  */}
      <a href="/" className={logoVariants[variant]}>
        {/* Logo image */}
        <img src={variant=='white'?'/lotus-white.svg':'/lotus.svg'} alt="Logo" />
        {/* Logo text */}
        <span className={logoTextStyle}>Beauty by Gulia</span>
      </a>
    </>
  );
};

// Define the prop types for the Logo component
Logo.propTypes = {
  variant: PropTypes.string, // variant prop is optional
};

// Export the Logo component
export default Logo;
