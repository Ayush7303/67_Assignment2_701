const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const Student = require('./models/student');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect('mongodb://localhost/a2q4', { useNewUrlParser: true, useUnifiedTopology: true });

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.set('view engine', 'ejs');

app.post('/login', (req, res) => {

  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, 'abc');
    req.session.user = { username, token };
    res.redirect('/students');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.post('/students', isAuthenticated, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.redirect('/students');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/students', isAuthenticated, async (req, res) => {
  try {
    const students = await Student.find();
    res.render('students', { students });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/students/:id', isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body);
    res.send(student);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/students/:id', isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    res.send(student);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
