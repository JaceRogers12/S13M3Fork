const express = require('express');
const Users = require("./users-model.js");
const Posts = require("../posts/posts-model.js");
const {
  validateUserId,
  validateUser,
  validatePost,
  errorCatcher
} = require("../middleware/middleware.js");
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
  const users = await Users.get();
  res.status(200).send(users);
  } catch (err) {
    next(err)
  }
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post('/', validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    let newUser = await Users.insert(req.body);
    res.status(201).send(newUser);
  } catch(err) {
    next(err);
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    let updatedUser = await Users.update(req.params.id, req.body);
    res.status(200).send(updatedUser);
  } catch(err) {
    next(err);
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await Users.remove(req.params.id);
    res.status(200).send(req.user);
  } catch(err) {
    next(err);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    let userPosts = await Users.getUserPosts(req.params.id);
    res.status(200).send(userPosts);
  } catch(err) {
    next(err);
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    let newPost = await Posts.insert({user_id: req.params.id, text: req.body.text});
    res.status(201).send(newPost);
  } catch(err) {
    next(err);
  }
});

router.use(errorCatcher);

// do not forget to export the router
module.exports = router;
