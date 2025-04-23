const jwt = require('jsonwebtoken');

// Example user data (replace with actual user data if needed)
const user = {
  userId: 1,
  role: 'Admin', // or 'Student', 'Organisator', depending on the user you want to generate the token for
  username: 'exampleUser'
};

// Your JWT secret key (replace with the actual secret key used in your backend)
const secretKey = 'your-secret-key';

// Generate JWT with a 1-hour expiration
const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

console.log('Generated JWT Token:', token);
