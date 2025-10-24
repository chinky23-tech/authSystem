const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

require('dotenv').config();

const user = require('./models/user');
const app = express();

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
})
);
// mongodb connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

//routes
app.get('/' , (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
res.sendFile(path.join(__dirname, 'views', 'resgister.html'));
});

app.post('/register', async( req, res) => {
const {username, password} = req.body;
const existingUser = await User.findOne({ username});
if(existingUser) return res.send('User already exists');
const hashedPassword = await  bcrypt.hash(password, 10);
await User.create({username , password: hashedPassword});
res.redirect('/');
});

app.post('/login', async (req, res) => {
const { username , password} = req.body;
const user = await User.findOne({ username});
if(!user) return res.send('Invalid username or password');
 const isMatch = await bcrypt.compare(password, user.password);
 if(!isMatch) return res.send('Invalid username or password');

 req.session.user = user;
 res.redirect('/dashboard');
});

app.get('/dashboard' , (req, res) => {
if(!req.session.user) return res.redirect('/');
res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
 res.redirect('/');
    });
});

//start server
const PORT = 3000;
app.listen(PORT, () => console.log(`server running at http://localhost:${PORT}`));