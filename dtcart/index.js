require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // ✅ MOVE UP

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'dtcart-secret-key',
    resave: false,
    saveUninitialized: false
  })
);

app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
const routes = require('./routes/index');
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
