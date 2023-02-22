const { validationResult } = require('express-validator/check');


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
    return res.status(422).json({
      message: 'Validation failed, data format entered is incorrect.',
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  // create post in db

  res.status(201).json({
    message: 'post created successfully',
    post: {
      _id: new Date().toString(),
      title: title,
      content: content,
      creator: { name: 'agatha' },
      createdAt: new Date(),
    },
    test: 'what is this',
  });
};
