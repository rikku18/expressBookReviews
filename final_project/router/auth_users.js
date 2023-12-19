const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js").books;
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization['username'];
  const ISBN = req.params.isbn;
  const reviewMessage = req.body.message;
  // Check if the book with the given key exists
  if (books.hasOwnProperty(ISBN)) {
    // Update the reviews for the specified book
    books[ISBN].reviews[username] = reviewMessage;
    return res.status(200).json({message: `Review for book with ISBN ${ISBN} has been added/updated`});
  }
  
  console.log(`Book with ISBN ${ISBN} not found.`);

  return res.status(300).json({message: `Book with ISBN {ISBN} not found`});
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization['username'];
  const ISBN = req.params.isbn;
  // Check if the book with the given key exists
  if (books.hasOwnProperty(ISBN)) {
    // Update the reviews for the specified book
    if (books.hasOwnProperty(ISBN)) {    
      if (books[ISBN].reviews.hasOwnProperty(username)) {
        // Delete the specified review
        delete books[ISBN].reviews[username];
        return res.status(200).json({message:  `Review for book posted by ${username} has been deleted`});
      }
    }
  }
  return res.status(300).json({message: `Review for book posted by ${username} not found`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
