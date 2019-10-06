const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

const blogPosts = mongoose.model("blogpost", blogPostSchema);

module.exports = blogPosts;