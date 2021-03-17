const express = require('express');
const router = express.Router();
const {Book} = require('../models');

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}


/* GET home page. */
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll({
    order: [['title', 'ASC']]
  });
  res.render('index', {books, title: 'SQL Library Manager'});
}));

/* GET book detail page. */
router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  let book = null; // prime with null value for error handling conditional below

  for (let i = 0; i < books.length; i++) {
    if (books[i].id == req.params.id) {
      book = books[i]
    }
  }

  if (!book) {
    const err = new Error();
    err.message = 'Book does not exist in our library.';
    err.status = 404;
    next(err);
  } else {
      res.render("update-book", { book, title: 'Update Book' });
  }  
}));

module.exports = router;