const express = require('express');
let books = require("./booksdb.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const hasAuthor = (books, authorName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const listBooks = [];
      for (let key in books) {
        if (books[key].author === authorName) {
          const copyOfBook = books[key];
          copyOfBook['isbn'] = key;
          listBooks.push(copyOfBook);
        }
      }
      resolve(listBooks);
    }, 500);
  });
};

const hasTitle = (books, Title) =>{
  return new Promise((resolve) => {
    setTimeout(() => {
      const listBooks = [];
      for (let key in books) {
        if (books[key].title === Title) {
          const copyOfBook = books[key];
          copyOfBook['isbn'] = key;
          listBooks.push(copyOfBook);
        }
      }
      resolve(listBooks);
    }, 500);
  });
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register Customer."});
});

function fetchData() {   return new Promise((resolve) => {     
  setTimeout(() => {  resolve(books); }, 1000); }); 
}  

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  const books = await fetchData();
  const response = {
    books: books
  };
  return res.send(JSON.stringify(response,null,4));
});

const getBookDetailsByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookDetails = books[isbn];
      if (bookDetails) {
        resolve(bookDetails);
      } else {
        reject(new Error('Book not found'));
      }
    }, 500); 
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  getBookDetailsByISBN(ISBN)
    .then((bookDetails) => {
      return res.send(bookDetails);
    })
    .catch((error) => {
      console.error(error);
      return res.status(404).send('Book not found');
    });
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = await hasAuthor(books, author);
  if(booksByAuthor.length>0){
    const response = {
      booksByAuthor: booksByAuthor
    };
    return res.send(JSON.stringify(response, null, 4));
  }
  return res.status(300).json({message: "Author Not Found"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = await hasTitle(books, title);
  if(booksByTitle.length>0){
    const response = {
      booksByTitle: booksByTitle
    };
    return res.send(JSON.stringify(response, null, 4));
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const response = {
    review: books[ISBN].reviews
  };
  res.send(JSON.stringify(response, null, 4))
});

module.exports.general = public_users;
