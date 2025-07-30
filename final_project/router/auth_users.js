const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let username = "test123";
let password =  "pass123";

const jwtSecret = "244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273";

let users = [{"username": "test123", "password": "pass123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // return Boolean(Object.values(users).find(u => u.username === username));
    return users.filter( u => u.username === username).length > 0;
}

// const authenticatedUser = async (username,password) => { //returns boolean
// //write code to check if username and password match the one we have in records.
//     //add async with promise
//      let myPromise = new Promise(resolve => {
//         if (Object.values(users).find(u => u.username === username) && Object.values(users).find(p => p.password === password)) {        
//             if(req.session.authorization) {
//                 let token = req.session.authorization["token"];

//                 jwt.verify(token, "access", (err, user) => {
//                     if(!err) {
//                         req.user = user;
//                         next()
//                     }
//                     else {
//                         return true;
//                         // return res.status(403).json({ message: "User not authenticated" });
//                     }
//             })
//         }
//         else {
//             return false;
//             // return res.status(403).json({ message: "User not logged in." });
            
//         }
//     }});
// }
const authenticatedUser = (username, password) => { 
    return users.filter(u => u.username === username && u.password === password).length > 0;
    
}
//only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   const username = req.body.username;
//   const password = req.body.password;

// //   const { username, password } = req.body;
//     const user = users.find(u => u.username === username && u.password === password);
// // authenticatedUser(username, password);
//   if(username && password) {
//     // isValid(username);
//     if (!Object.values(users).includes(username)) {

//         users.push({"username": username, "password": password});
//         return res.status(200).json({message: "User successfully registered. Now you can login"});
//     } else {
//         return res.status(404).json({message: "User already exists!"});
//     }
//   }
  
//   return res.status(404).json({message: "Unable to register user."});
// });

//only registered users can login
// regd_users.post("/login", (req, res) => {
//     //Write your code here
//     // const { username, password } = req.body;
//     const username = req.query.body;
//     const password = req.query.body;
//     const user = users.find(u => u.username === username && u.password === password);
//     if (user) {
//         const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
//         res.status(200).json({ token });
//     } else {
//         res.status(401).json({ message: "Invalid username or password" });
//     }
// });

regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let token = jwt.sign({
            username: username,
            password: password
        }, jwtSecret, { expiresIn: '1h' });

        req.session.authorization = {
            token
        };
        
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let token = req.session.authorization["token"] ?? res.status(401).json({ message: "No token provided" });
  const author = req.params.isbn;
  const decoded = jwt.verify(token, jwtSecret);
//   const username = decoded.username;

  
  let book = Object.values(books).find(a => a.author === author)
  if (book) {
      if (!book.reviews) {
          book.reviews = {};
      }
      book.reviews = {
                    "review": req.query.review,
                    "username": req.session.username,
                    }
    
    res.status(200).json({ message: "Review added/updated successfully" });
} else {
    res.status(404).json({ message: "Book not found" });
}


//   const review = "";
//   if(review) {
//     Object.values(books).find(a => a.author === author).reviews = review;
//   }
//   else {
//     res.send("Reveiw is an empty string.");
//   }
//   return res.status(300).json({message: "Review added!"});
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let token = req.session.authorization["token"] ?? res.status(401).json({ message: "No token provided" });
    const author = req.params.isbn;
    const decoded = jwt.verify(token, jwtSecret);
    const username = decoded.username;

 


    books = Object.values(books).filter(a => a.author !== author);
    console.log(books)
    //delete books[author].reviews[username];
    return res.status(300).json({message: "Review deleted!"});
});

regd_users.get('/',function (req, res) {
  
      res.send(JSON.stringify(books,null,4))
    return res.status(300).json({message: "All books printed!"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.jwtSecret = jwtSecret;
