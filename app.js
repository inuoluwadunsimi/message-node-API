require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet')

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();
mongoose.set('strictQuery', false);

app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(helmet())
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-requested-With, Content-Type, Accept'
//   );
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
//     return res.status(200).json({});
//   }
//   next();
// });

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    const server = app.listen(8080);
    const io = require('./socket').init(server)
    io.on('connection', (socket) => {
      console.log('client connected');
    });
  })
  .catch((err) => {
    console.log(err);
  });
