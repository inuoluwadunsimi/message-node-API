const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use('/feed', feedRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
