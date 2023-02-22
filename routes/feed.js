const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator/check');

const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);

router.post(
  '/create-post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

module.exports = router;
