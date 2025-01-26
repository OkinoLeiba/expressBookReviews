const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//only registered users can login
public_users.post("/login", (req, res) => {
    //Write your code here
    // const { username, password } = req.body;
    const username = req.query.body;
    const password = req.query.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: username });
    }
});


public_users.post("/register", (req,res) => {
  //Write your code here
//   const username = req.params.username;
//   const password = req.params.password;
  const username = req.query.username;
  const password = req.query.password;
  
  if(username && password) {
    if (users.map(u => u.username === username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  else {
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
  
//     res.send(JSON.stringify(books,null,4))
//   return res.status(300).json({message: "All books printed!"});
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const author = req.params.author;
    
  let filtered_book = Object.values(books).filter(a => a.author === author);
  
  res.send(filtered_book);
  return res.status(300).json({message: "Book by ISBN!"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    
    let filtered_book = Object.values(books).filter(a => a.author === author);
    
    res.send(filtered_book);
    return res.status(300).json({message: "Book by Author!"});
   
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    
  let filtered_book = Object.values(books).filter(a => a.title === title);
  
  res.send(filtered_book);
  return res.status(300).json({message: "Book by Title!"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.author;
    
  let filtered_book = Object.values(books).filter(a => a.author === isbn);
  
  res.send(filtered_book);
  return res.status(300).json({message: "Book by ISBN!"});
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('URL_TO_GET_BOOKS');
        const books = response.data;
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`URL_TO_GET_BOOK_BY_ISBN/${isbn}`); // Replace with the actual URL or API endpoint
        const book = response.data;
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`URL_TO_GET_BOOKS_BY_AUTHOR/${author}`);
        const booksByAuthor = response.data;
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`URL_TO_GET_BOOKS_BY_TITLE/${title}`);
        const booksByTitle = response.data;
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).send(book.reviews);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

module.exports.general = public_users;
