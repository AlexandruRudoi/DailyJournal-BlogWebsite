// Global declarations
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true});

// Schema for blog posts
const postSchema = {
  title: String,
  content: String
};

// Create a collection
const Post = mongoose.model('Post', postSchema);

// Text
const homeStartingContent = "Welcome to DAILY JOURNAL .Your presence made our blog feel like a big music festival. You could really feel the shift in energies in the room. How do you do that? Anyway, thank you so much for being there!";
const aboutContent = "DAILY JOURNAL is a blog website. A blog according to Dictionary.com is “a website containing a writer’s or group of writers own experiences, observations, opinions, etc., and often having images and links to other websites.";
const contactContent = "Do you have any questions? Please do not hesitate to contact us directly. Our team will come back to you within a matter of hours to help you.";

// Getting the routes for home page
app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    res.render("home", {
      startingContent: homeStartingContent, 
      posts: posts
    });
  });
});

// Getting the routes for about page
app.get("/about", (req, res) => {
  res.render("about", {aboutContent : aboutContent});
});

// Getting the routes for contact page
app.get("/contact", (req, res) => {
  res.render("contact", {contactContent : contactContent});
});

// Getting the routes for compose page
app.get("/compose", (req, res) => {
  res.render("compose");
});

// Getting the routes for the custom post page
app.get("/posts/:postId", (req, res) =>  {
  const requestedPostId = req.params.postId;
  Post.findById(requestedPostId, (err, post) => {
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("post", {
        postTitle: post.title,
        postContent: post.content
      });
    }
  });
});

// Getting the data from compose page
app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });
  post.save((err) => { (!err) ? res.redirect("/") : console.log(err); });
});

// Getting the data from delete form
app.post("/delete-post", (req, res) => {
  const postId = req.body.postId;
  Post.findByIdAndDelete(postId, (err) => {
    (!err) ? res.redirect("/") : console.log(err);
  });
});

// Running the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
