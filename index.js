const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config();
// connect to DB
 mongoose.connect(process.env.DB_Connect,
{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=>{ return console.log("Connected to MongoDB Localhost...");
 })
.catch(err => console.log("Could not connect",err))

// Import Routes
const authRoute = require('./routes/auth');
const uploadRoute = require('./routes/upload_image')
// middlewares
app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/', uploadRoute)
app.use('/uploads', express.static('uploads'));
app.listen(3000, ()=>console.log('server up and running'));