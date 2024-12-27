const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "username", "password": "password"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return Boolean(Object.values(users).find(u => u.username === username));
}

const authenticatedUser = async (username,password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    //add async with promise
     let myPromise = new Promise(resolve => {
        if (Object.values(users).find(u => u.username === username) && Object.values(users).find(p => p.password === password)) {        if(req.session.authorization) {
            let token = req.session.authenticated["accessToken"];

            jwt.verify(token, "access", (err, user) => {
                if(!err) {
                    req.user = user;
                    next()
                }
                else {
                    return true;
                    // return res.status(403).json({ message: "User not authenticated" });
                }
            })
        }
        else {
            return false;
            // return res.status(403).json({ message: "User not logged in." });
            
        }
    }});
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

// authenticatedUser(username, password);
  if(username && password) {
    // isValid(username);
    if (!Object.values(users).includes(username)) {

        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  
  return res.status(404).json({message: "Unable to register user."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const author = req.params.author;
  const review = "";
  if(review) {
    Object.values(books).find(a => a.author === author).reviews = review;
  }
  else {
    res.send("Reveiw is an empty string.");
  }
  return res.status(300).json({message: "Review added!"});
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const author = req.params.author;

    books = Object.values(books).filter(a => a.title !== isbn);

    return res.status(300).json({message: "Review deleted!"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
