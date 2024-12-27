const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.params.username;
  const password = req.params.password;
  if(username && password) {
    if (!users.map(u => u.username === username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
    res.send(JSON.stringify(books,null,4))
  return res.status(300).json({message: "All books printed!"});
});

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
  const isbn = req.params.isbn;
    
  let filtered_book = Object.values(books).filter(a => a.title === isbn);
  
  res.send(filtered_book);
  return res.status(300).json({message: "Book by ISBN!"});
});

module.exports.general = public_users;
