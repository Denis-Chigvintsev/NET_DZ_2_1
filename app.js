const express = require('express');
const app = express();
app.use(express.json());

const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

if (!PORT) {
  console.log(' в файле .env не указан номер порта сервера');
  return;
}

const books = [];
const users = [];

const store = {
  books: books,
  users: users,
};

class User {
  constructor(user_ID, email = 'test@mail.ru') {
    this.user_ID = user_ID;
    this.email = email;
  }
}

class Book {
  constructor(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    id = uuidv4()
  ) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.id = id;
  }
}
////////////////////////////блок функций и ниже блок маршрутов///////////////
function getAllBooks(req, res) {
  const { books } = store;
  res.send(books);
}
function getBookByID(req, res) {
  const { books } = store;
  let { id } = req.params;
  let idx = books.findIndex((el) => el.id == id);
  if (idx == -1) {
    res.status(404);
    res.send('404 | данные не найдены');
  } else res.send(books[idx]);
}
function postNewBook(req, res) {
  const { books } = store;

  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );

  books.push(newBook);
  res.status(201);
  res.send(newBook);
}

function editBookByID(req, res) {
  const { books } = store;
  let { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  let idx = books.findIndex((el) => el.id == id);
  if (idx == -1) {
    res.status(404);
    res.send('404 | данные не найдены');
  } else {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };
  }
  res.send(books[idx]);
}

function deleteBookByID(req, res) {
  const { books } = store;
  let { id } = req.params;
  let idx = books.findIndex((el) => el.id == id);
  if (idx == -1) {
    res.status(404);
    res.send('404 | данные не найдены');
  } else {
    books.splice(idx, 1);
    res.status(201);
    res.send('OK');
  }
}
////
function postNewUser(req, res) {
  const { users } = store;
  const { user_ID } = req.body;
  const newUser = new User(user_ID);

  users.push(newUser);
  res.status(201);
  res.send(newUser);
}

////блок маршрутов
app.get('/api/books', getAllBooks);
app.get('/api/books/:id', getBookByID);
app.post('/api/books', postNewBook);
app.put('/api/books/:id', editBookByID);
app.delete('/api/books/:id', deleteBookByID);
/////
app.post('/api/users', postNewUser);

///////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`\nсервер запущен на порте ${PORT}`);
});
