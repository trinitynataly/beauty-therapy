/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 06/08/2024
A set of helper functions for hashing and verifying passwords, generating and verifying JWT tokens.
*/

// Import the JWT library for token generation and verification
const jwt = require('jsonwebtoken');
// Import the Bcrypt library for password hashing and verification
const bcrypt = require('bcrypt');

/**
 * Hash the user password with a salt and pepper.
 * @param {string} password - the user password to hash
 * @returns {Promise<*>} - the hashed password
 */
const hashPassword = async (password) => {
    // Generate a salt for the password hash
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt and pepper
    return await bcrypt.hash(password + process.env.PEPPER, salt);
};

/**
 * Verify the user password with the hash and pepper.
 * @param {string} password - the user password to verify
 * @param {string} hash - the hashed password to compare
 * @returns {Promise<*>} - the result of the password verification
 */
const verifyPassword = async (password, hash) => {
    // Compare the password with the hash and pepper
    return await bcrypt.compare(password + process.env.PEPPER, hash);
};

/**
 * Verify the JWT token with the secret.
 * @param {string} token - the JWT token to verify
 * @returns {boolean|object} - the verified token payload or false if invalid
 */
const verifyToken = (token) => {
    // Attempt to decode and verify the token
    try {
        // Decode the token to extract the token type
        const decoded = jwt.decode(token);
        // Check the token type and verify the token with the appropriate secret
        if (decoded && decoded.tokenType) {
            // Select the secret based on the token type
            const secret = decoded.tokenType === 'accessToken'
                ? process.env.JWT_SECRET // Access token secret
                : process.env.JWT_REFRESH_SECRET; // Refresh token secret
            // Verify the token with the secret
            const verified = jwt.verify(token, secret);
            // Return the verified payload
            return verified;
        } else {
            // Return false if the token type is missing
            return false;
        }
    } catch (err) {
        // Return false if the token is invalid or expired
        return false;
    }
};

/**
 * Decode the JWT token and return the payload.
 * @param {string} token - the JWT token to decode
 * @returns {object} - the decoded token payload
 */
const decodeToken = (token) => {
    // Decode the token and return the payload
    return jwt.decode(token);
};

/**
 * Populate user details from user object for tokens
 * @param {object} user - the user object
 * @returns {object} - the user data
 */
const getUserDetails = (user) => {
    // Return the user details for the token
    return { 
        firstName: user.firstName, // Populate the user's first name
        lastName: user.lastName,  // Populate the user's last name
        email: user.email, // Populate the user's email
        isAdmin: user.isAdmin  // Populate the user's isAdmin flag
    }
}

/**
 * Generate access and refresh tokens for the user.
 * @param {object} user - the user object to generate tokens for
 * @returns {{accessToken: string, refreshToken: string}} - the generated tokens
 */
const generateTokens = (user) => {
    // Generate an access token with a short expiry time
    const accessToken = jwt.sign(
        {
            tokenType: "accessToken", // Token type
            user: getUserDetails(user) // Populate user details for token
        },
        process.env.JWT_SECRET, // Use the access token secret
        { expiresIn: '10m' } // Set the expiry time to 10 minutes
    );
    // Generate a refresh token with a long expiry time
    const refreshToken = jwt.sign(
        {
            tokenType: "refreshToken",  // Token type
            user: getUserDetails(user) // Populate user details for token
        },
        process.env.JWT_REFRESH_SECRET, // Use the refresh token secret
        { expiresIn: '30d' } // Set the expiry time to 30 days
    );
    // Return the generated tokens
    return { accessToken: accessToken, refreshToken: refreshToken };
};

// Export the helper functions for password hashing and token management
module.exports = { hashPassword, verifyPassword, verifyToken, decodeToken, generateTokens };
