const express = require('express');
const router = express.Router();
const {Book} = require('../models');

// Handler for all following routes
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

//GET route for home
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll({order: [['title', 'ASC']]
  });
  res.render('index', {books, title: 'SQL Library Manager'});
}));

//GET route for new book
router.get('/books/new', asyncHandler(async(req, res) => {
  res.render("new-book", { book: {title: "", author: "", genre: "", year: ""}, title: 'New Book' });
}));

//POST route for new book
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  console.log(req.body);
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
  } catch (err) {
    if (err.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: err.errors, title: "New Book" })
    } else {
      throw err; 
    }  
  }
}));

// GET route for individual book
router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  let book = null; // prime with null value for error handling conditional below

  for (let i = 0; i < books.length; i++) {
    if (books[i].id == req.params.id) {
      book = books[i];
    }
  }

  //Error handling for book not found
  if (!book) {
    const err = new Error();
    err.message = 'Book does not exist in our library.';
    err.status = 404;
    next(err);
  } else {
    res.render('update-book', { book, title: 'Update Book' });
  }  
}));

//POST route for updating book
router.post('/books/:id', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; 
      res.render("update-book", { book, errors: err.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

// POST route for deleting book
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;