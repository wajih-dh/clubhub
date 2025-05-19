const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const signupRoute = require('./routes/signup');
const signinRoute = require('./routes/signin');
const eventRoute = require('./routes/event');
const getUsersRoute = require('./routes/get-users');
const deleteUserRoutes = require('./routes/delete-user');  
const updateUserRoutes = require('./routes/update-user');
const getUserByIdRoutes = require('./routes/get-user-by-id');
const participantRoute = require('./routes/participant');
const emailRoutes = require('./routes/email');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/participant', participantRoute);
app.use('/api/email', emailRoutes);
app.use('/api/signup', signupRoute);
app.use('/api/signin', signinRoute);
app.use('/api/events', eventRoute);
app.use ('/api/users', getUsersRoute);
app.use('/api/users', deleteUserRoutes);  
app.use('/api/users', updateUserRoutes);
app.use('/api/users', getUserByIdRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
