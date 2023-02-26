const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const router = express.Router();
// const cors = require('cors')

const authController = require('../controllers/auth');

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email already exists');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim()
  ],
  authController.postSignup
);

module.exports = router;


router.post('/login',authController.postLogin)