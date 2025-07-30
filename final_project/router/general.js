const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let jwtSecret = require("./auth_users.js");
const public_users = express.Router();

//only registered users can login
// public_users.post("/login", (req, res) => {
//     //Write your code here
//     // const { username, password } = req.body;
//     const username = req.query.username;
//     const password = req.query.password;

//     const user = users.find(u => u.username === username && u.password === password);

//     if (user) {
//         const token = jwt.sign({ username: user.username }, jwtSecret.toString(), { expiresIn: '1h' });
//         req.session.authorization = {
//             token, username, password
//         } 
        
//   
//         res.status(200).json({message: token + " token logged in successfully" });
//     } else {
//         res.status(401).json({ message: username });
//     }
// });


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
public_users.get('/',function (req, res) {
  //Write your code here
  
    res.send(JSON.stringify(books,null,4))
  return res.status(300).json({message: "All books printed!"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const author = req.params.isbn;
  
    
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
        
        const response = await axios.get('./router/booksdb.js');
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
        const response = await axios.get(`isbn/${isbn}`); // Replace with the actual URL or API endpoint
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
        const response = await axios.get(`author/${author}`);
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
        const response = await axios.get(`title/${title}`);
        const booksByTitle = response.data;
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.author;
    const book = books[isbn];
    if (book) {
        res.status(200).send(book.reviews);
    } else {
        res.status(404).send({ message: "Book not found" });
    }






    
    // Task 10 
    // Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios
    
    function getBookList() {
        return new Promise((resolve, reject) => {
            resolve(books);
        })
    }
    
    // Get the book list available in the shop
    public_users.get('/', function (req, res) {
        getBookList().then(
            book => res.send(JSON.stringify(book, null, 4)),
            (error) => res.send("Unable to find book!")
        );
    });
    
    // Task 11
    // Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
    
    function getISBN(isbn) {
        let book_ = books[isbn];
        return new Promise((resolve, reject) => {
            if (book_) {
                resolve(book_);
            } else {
                reject("Unable to find book!");
            }
        })
    }
    
    // Get book details based on ISBN
    public_users.get('/isbn/:isbn', function (req, res) {
        const isbn = req.params.isbn;
        getISBN(isbn).then(
            b => res.send(JSON.stringify(b, null, 4)),
            (error) => res.send(error)
        )
    });
    
    // Task 12
    // Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.
    
    function getAuthor(author) {
        let output = [];
        return new Promise((resolve, reject) => {
            for (var isbn in books) {
                let book = books[isbn];
                if (book.author === author) {
                    output.push(book);
                }
            }
            resolve(output);
        })
    }
    
    // Get book details based on author
    public_users.get('/author/:author', function (req, res) {
        const author = req.params.author;
        getAuthor(author)
            .then(
                book => res.send(JSON.stringify(book, null, 4))
            );
    });
    
    // Task 13
    // Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.
    
    
    function getTitle(title) {
        let output = [];
        return new Promise((resolve, reject) => {
            for (var isbn in books) {
                let book = books[isbn];
                if (book.title === title) {
                    output.push(book);
                }
            }
            resolve(output);
        })
    }
    
    // Get all books based on title
    public_users.get('/title/:title', function (req, res) {
        const title = req.params.title;
        getTitle(title)
            .then(
                book => res.send(JSON.stringify(book, null, 4))
            );
    });
});

module.exports.general = public_users;
