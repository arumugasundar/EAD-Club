const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const fileUpload = require('express-fileupload');


const dataRoutes = require('./routes/functions');
const discussRoutes = require('./routes/discuss')
const articles = require('./routes/article');
const newsRoutes = require('./routes/news');
const profileRoute = require('./routes/profile-functions');
const adminRoutes = require('./routes/admin-functions');

const app = express();

mongoose.connect('mongodb://127.0.0.1/EadClub'
  ,{useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex : true ,  useFindAndModify: false })
  .then(() => {
    console.log('Connected to Database!');
  })
  .catch(() =>{
    console.log('Connection Failed!');
  });

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

//app.use(upload.array());
//app.use(express.static('public'));

app.use(cors());
/*app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
})*/

app.use("/api/data",dataRoutes);
app.use("/api/data",profileRoute);
app.use("/api/articles",articles);
app.use("/api/news",newsRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/discuss",discussRoutes);

module.exports = app;
