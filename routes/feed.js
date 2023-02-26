const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const cors = require('cors');

const feedController = require('../controllers/feed');

router.get('/posts', cors(),feedController.getPosts);

router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);


router.get('/post/:postId', feedController.getOnePost);

router.put(
  '/post/:postId',
  cors(),
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
  );
  
  router.delete('/post/:postId', cors(), feedController.deletePost);

  
  module.exports = router;
