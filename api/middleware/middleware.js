const Users = require("../users/users-model.js");

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`Request Method: ${req.method}`, `Request Url: ${req.url}`, `Timestamp: ${new Date()}`);
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const selectedUser = await Users.getById(req.params.id);
  if (selectedUser) {
    req.user = selectedUser;
    next();
  } else (
    next({status: 404, message: "user not found"})
  )
}

async function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const {name} = req.body;
  if (!name) {
    next({status: 400, message: "missing required name field"})
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const {text} = req.body;
  if (!text) {
    next({status: 400, message: "missing required text field"})
  } else {
    next();
  }
}

//error catcher
function errorCatcher(err, req, res, next) {
  if (!err.status || err.status == 500) {
    err.status = 500;
    err.message = "Sorry, there was some issue with the server";
   }
  res.status(err.status).json({message: err.message});
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
  errorCatcher
}