const User = require('../models/user');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'danielolaoladeinde@gmail.com',
    pass: process.env.GMAIL_PASS,
  },
});

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    errors.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Successfully signed up',
        userId: result,
      });
      return transporter.sendMail({
        to: email,
        from: 'danielolaoladeinde@gmail.com',
        subject: 'Signup Succeded',
        html: '<h1> You successfully signed up, welcome to the goodlife  </h1>',
      });
    })
    .catch((err) => {
      next(err);
    });
};
