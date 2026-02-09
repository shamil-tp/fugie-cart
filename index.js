require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine setup (optional, as user said they will give ejs later, but good to have ready)
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
const routes = require('./routes/index');
app.use('/', routes); // Mounting at root to allow /login, /, /cart etc.

// API routes can also be accessed if needed, but for now we mix them or separate them. 
// User asked for "express and ejs only" so likely root handled.

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
