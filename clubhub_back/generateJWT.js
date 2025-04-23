const jwt = require('jsonwebtoken');

// Example user data
const user = {
  userId: 1,
  role: 'Admin', // Or 'Student', 'Organisator'
  username: 'exampleUser'
};

// Must match JWT_SECRET in your backend .env
const secretKey = 'secretkey';

// Generate JWT with a 1-hour expiration
const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

console.log('Generated JWT Token:', token);
