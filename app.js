const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// App config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB database 
const dataBase = require("./config/keys").mongoURI;
// Mongo Schema
const blogPosts = require("./models/posts");

mongoose.connect(dataBase, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// RESTful routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
    blogPosts.find({})
    .then(allBlogPosts => {
        res.render("index", {posts: allBlogPosts});
    })
    .catch(err => {
        console.log(err)
    });
});



// Server setup
app.listen(4500, () => {
    console.log("Server started")
});