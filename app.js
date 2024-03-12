
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require("multer");


const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const eventRoute = require('./routes/events');

const app = express();

// View engine setup (if you're using a template engine like Jade)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup
app.use(cors({
  origin:['https://localconnectprojectfeclient.onrender.com','http://localhost:3000']
}));
/*app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));*/

dotenv.config();

// MongoDB connection
mongoose.connect('mongodb+srv://anushma2015:RTecMjFUxbQO7plU@cluster0.59qkwy6.mongodb.net/localconnect');
console.log("connected to MongoDB")  //this will disable when connected to atlas
//mongoose.connect('mongodb://127.0.0.1:27017/Localconnectapp');
//console.log("Connected to MongoDB");


// Middleware for verifying JWT token
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.json("Token not available");
  } else {
    jwt.verify(token, "localconnectsecretkey", (err, decoded) => {
      if (err) return res.json("Wrong token");
      req.user = decoded;
      next();
    });
  }
};

app.use("/postImages", express.static(path.join(__dirname, "public/postImages")));

// Routes
app.get('/home', verifyUser, (req, res) => {
  return res.status(200).json({ success: true, message: "Authentication successful", user: req.user });
});


// Middleware for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/postImages/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({ message: "File uploaded successfully", fileName: req.file.filename });
  } catch (err) {
    console.log(err);
  }
});

// Routes

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use('/api/events', eventRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Interval function for deleting outdated events
setInterval(async () => {
  try {
    const result = await Event.deleteMany({ date: { $lt: new Date() } });
    console.log(`Deleted ${result.deletedCount} outdated events.`);
  } catch (error) {
    console.error('Error deleting outdated events:', error);
  }
}, 24 * 60 * 60 * 1000); // Run every 24 hours

// Export the app (if needed)
module.exports = app;
