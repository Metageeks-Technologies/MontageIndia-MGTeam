const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const dotenv = require('dotenv');
const connectDB = require("./src/api/config/db");

const authRoutes = require('./src/api/controllers/authRoutes');

require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, "/static")));

// Set Templating Engine
app
  .use(expressLayouts)
  .set("view engine", "ejs")
  .set("views", path.join(__dirname, "/content"));

// Define Routes
app.use('/api/auth', authRoutes);

// Render Pages
app.get("/", (req, res) => {
  res.render("index", {
    layout: path.join(__dirname, "/layouts/dashboard"),
    footer: true,
  });
});

app.get("/settings", (req, res) => {
  res.render("settings", {
    layout: path.join(__dirname, "/layouts/dashboard"),
    footer: true,
  });
});

// Authentication Pages
app.get("/authentication/forgot-password", (req, res) => {
  res.render("authentication/forgot-password", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

app.get("/authentication/profile-lock", (req, res) => {
  res.render("authentication/profile-lock", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

app.get("/authentication/sign-in", (req, res) => {
  res.render("authentication/sign-in", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

app.get("/authentication/sign-up", (req, res) => {
  res.render("authentication/sign-up", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

app.get("/authentication/reset-password", (req, res) => {
  res.render("authentication/reset-password", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

// CRUD Pages
app.get("/crud/products", (req, res) => {
  const products = require("./data/products.json");
  res.render("crud/products", {
    layout: path.join(__dirname, "/layouts/dashboard"),
    footer: false,
    products,
  });
});

app.get("/crud/users", (req, res) => {
  const users = require("./data/users.json");
  res.render("crud/users", {
    layout: path.join(__dirname, "/layouts/dashboard"),
    footer: false,
    users,
  });
});

// Layouts Pages
app.get("/layouts/stacked", (req, res) => {
  res.render("layouts/stacked", {
    layout: path.join(__dirname, "/layouts/stacked-layout"),
    footer: true,
  });
});

app.get("/layouts/sidebar", (req, res) => {
  res.render("layouts/sidebar", {
    layout: path.join(__dirname, "/layouts/dashboard"),
    footer: true,
  });
});

// Other Pages
app.get("/pages/404", (req, res) => {
  res.render("pages/404", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

app.get("/pages/500", (req, res) => {
  res.render("pages/500", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

app.get("/pages/maintenance", (req, res) => {
  res.render("pages/maintenance", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: false,
    footer: false,
  });
});

app.get("/pages/pricing", (req, res) => {
  res.render("pages/pricing", {
    layout: path.join(__dirname, "/layouts/main"),
    navigation: true,
    footer: false,
  });
});

// Playground Pages
app.get("/playground/sidebar", (req, res) => {
  res.render("playground/sidebar", {
    layout: path.join(__dirname, "/layouts/dashboard"),
    footer: true,
  });
});

app.get("/playground/stacked", (req, res) => {
  res.render("playground/stacked", {
    layout: path.join(__dirname, "/layouts/stacked-layout"),
    footer: true,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
