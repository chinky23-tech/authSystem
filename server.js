// server.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

// ✅ Import User model
const User = require("./models/user");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "mySecretKey", // change this to a strong secret in production
    resave: false,
    saveUninitialized: false,
  })
);

// MongoDB connection (local)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes

// Home (Login page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Register page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Register POST
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.send("⚠️ User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("❌ Error registering user");
  }
});

// Login POST
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.send("❌ Invalid username or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("❌ Invalid username or password");

    // Save user session
    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("❌ Error logging in");
  }
});

// Dashboard (protected)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Start server
const PORT = 3030;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
