const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const signupRoute = require('./routes/signup');
const signinRoute = require('./routes/signin');
const eventRoute = require('./routes/event');



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/signup', signupRoute);
app.use('/api/signin', signinRoute);
app.use('/api/events', eventRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
