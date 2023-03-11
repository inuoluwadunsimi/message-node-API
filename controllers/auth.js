require('dotenv').config();
const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'danielolaoladeinde@gmail.com',
    pass: process.env.GMAIL_PASS,
  },
});

exports.postSignup = async (req, res, next) => {
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
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });
    const result = await user.save();
    res.status(201).json({
      message: 'Successfully signed up',
      userId: result._id,
    });
    return transporter.sendMail({
      to: email,
      from: 'danielolaoladeinde@gmail.com',
      subject: 'Signup Succeded',
      html: '<h1> You successfully signed up, welcome to the goodlife  </h1>',
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User with this email does not exist');
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is wrong');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

exports.getStatus = async (req, res, next) => {
  const user = await User.findById(req.userId);
  try {
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      message: 'status found',
      status: user.status,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const status = req.body.status;

  try {
    const user = User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }

    user.status = status;
    const result = await user.save();
    res.status(201).json({
      message: 'Status updated',
      status: result,
    });
  } catch (err) {
    next(err);
  }
};
