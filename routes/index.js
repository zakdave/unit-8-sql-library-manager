const express = require('express');
const router = express.Router();

//Handler for function below
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

//GET route to redirect to /books
router.get('/', asyncHandler(async(req, res, next) => {
  res.redirect('/books')
}));

module.exports = router;
