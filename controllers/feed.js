const { validationResult } = require('express-validator');
const Post = require('../models/post');
const fileHelper = require('../helpers/file');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find().populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched posts successfully',
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  try {
    const post = new Post({
      title: title,
      imageUrl: imageUrl,
      content: content,
      creator: req.userId,
    });
    post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    user.save();
    res.status(201).json({
      message: 'post created successfully',
      post: post,
      creator: {
        _id: creator._id,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOnePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('No post found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      post: post,
      message: 'Post successfully fetched',
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error('image is not set');
    error.statusCode = 404;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('post not found');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error('user is unauthorized');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      fileHelper.clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const updatedPost = await post.save();
    res.status(200).json({
      message: 'Post successfully updated',
      post: updatedPost,
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (post.creator.toString() !== req.userId) {
      const error = new Error('user is unauthorized');
      error.statusCode = 403;
      throw error;
    }
    if (!post) {
      const error = new Error('post not found');
      error.statusCode = 404;
      throw error;
    }

    fileHelper.clearImage(post.imageUrl);
    Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    user.save();
    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
