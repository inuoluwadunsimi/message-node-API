const { validationResult } = require('express-validator/check');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: 'The best way to die',
        content: 'This is about an imaginary movie I want to write',
        imageUrl: 'images/gooder.jpeg',
        creator: {
          name: 'Idan',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;

  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: 'OG waya waya for this one',
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'post created successfully',
        post: result,
      });
    })
    .catch((err) => {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    });
};
