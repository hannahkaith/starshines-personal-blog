require('dotenv').config(); // loads in hidden data

const express = require('express'); // load in Express
const expressLayout = require('express-ejs-layouts'); // reusable page structures
const methodOverride = require('method-override'); // to be able to use put and delete
const cookieParser = require('cookie-parser'); // read and write cookies
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');
const session = require('express-session');


const app = express(); // express application
const PORT = 5000 || process.env.PORT; // 5000 = default || a server default number

// connect database file
connectDB(); // running the function


// to pass data
app.use(express.urlencoded({ extended: true}));
app.use(express.json()); // understand JSON data

app.use(cookieParser()); // activates cookie parser
app.use(methodOverride('_method')); // to support PUT and DELETE methods

app.use(session({
  secret: 'what the helly',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));


app.use(express.static('public')); // folder called public

// templating engine
app.use(expressLayout);
app.set('layout', './layouts/main'); // default layout under a folder called layout
app.set('view engine', 'ejs');


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin')); // seperate route for admin pages

// tell the application to LISTEN to this port number
app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});