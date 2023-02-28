const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const cors = require('cors');

const feedController = require('../controllers/feed');

router.get('/posts', isAuth, cors(), feedController.getPosts);

router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.getOnePost);

router.put(
  '/post/:postId',
  isAuth,
  cors(),
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete('/post/:postId', isAuth, cors(), feedController.deletePost);


module.exports = router;
