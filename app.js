const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const app = express();

// App config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

// Index route
app.get("/blogs", (req, res) => {
    blogPosts.find({})
    .then(allBlogPosts => {
        res.render("index", {posts: allBlogPosts});
    })
    .catch(err => {
        console.log(err);
    });
});

// New route
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// Create route
app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body.blog.body);
    blogPosts.create(req.body.blog)
    .then(() => {
        res.redirect("/blogs");
    })
    .catch(err => {
        console.log(err);
    });
});

// Show route
app.get("/blogs/:id", (req, res) => {
    blogPosts.findById(req.params.id)
    .then((blogPost) => {
        res.render("show", {post: blogPost});
    })
    .catch((err) => {
        console.log(err);
    })
});

// Edit route
app.get("/blogs/:id/edit", (req, res) => {
    blogPosts.findById(req.params.id)
    .then(blogPost => {
        res.render("edit", {post: blogPost});
    })
    .catch(err => {
        console.log(err);
    });
});

// Update route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blogPosts.findByIdAndUpdate(req.params.id, req.body.blog)
    .then(() => {
        res.redirect(`/blogs/${req.params.id}`);
    })
    .catch(err => {
        console.log(err);
    })
});

// Delete route
app.delete("/blogs/:id", (req, res) => {
    blogPosts.findByIdAndRemove(req.params.id)
    .then(() => {
        res.redirect("/blogs");
    })
    .catch(err => {
        console.log(err);
    })
});


// Server setup
app.listen(4500, () => {
    console.log("Server started");
});