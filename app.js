require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "Your task today is another writing oriented challenge and is all about expressing an opinion. There are many factors that set great bloggers apart from the rest but one that Ive seen continually cropping up over the last few years of interacting with successful bloggers is that they often have and are not afraid to express strong opinions. While other bloggers in their niche report news it is those who express opinions about the news and current events in their industry that tend to be the blogs that get linked to by others, that generate more comments and that people look to as thought leaders in a niche";
const aboutContent =
  "Hi, I am Priyank! I am from Lucknow, India, and I am the founder of My-Openion. I started blogging because I have a strong passion for writing and wanted to inspire others to start writing, too. After many years of trying to find a job that reflected my love for writing, I decided to take matters into my own hands and start my own business. My Openion is an all-in-one writing platform that can help fellow aspiring writers learn their own way with words.";
const contactContent =
  "hey Guys are you lookin for a web-services.Don't Worry here is a solution .Subscribe our Newsletter for latest News and services. And check out About Me section, where You can find out my work and services. if you have any problum regarding creating a blog or about any post feel free to contact me from Know about me section .Here is a tip add '/compose' in above link and create your own post . Thank You so much For giving your Valuable time in My Openion. ";
const contents = [];
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set("strictQuery", false);

const PostSchema = new mongoose.Schema({
  title: String,
  post: String,
});
const Post = mongoose.model("Post", PostSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result)
      res.render("home", { content: homeStartingContent, posts: result });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { content: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact", { content: contactContent });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const newtitle = req.body.titlecontent;
  const newpost = req.body.postcontent;
  const post = new Post({
    title: newtitle,
    post: newpost,
  });
  post.save();
  const newpostcontent = { title: newtitle, post: newpost };
  contents.push(newpostcontent);
  res.redirect("/");
});

app.get("/posts/:topic", (req, res) => {
  const requestedtopic = _.lowerCase(req.params.topic);
  //  console.log(requestedtopic)
  Post.find({}, (err, result) => {
    if (!err) {
      result.map((item) => {
        const searchededtopic = _.lowerCase(item.title);
        if (searchededtopic === requestedtopic) {
          const postcontent = item.post;
          const postheading = _.upperFirst(searchededtopic);
          res.render("post", { heading: postheading, Content: postcontent });
        }
      });
    } else {
      console.log(err);
    }
  });

  // contents.map(item=>{
  //   const searchededtopic = _.lowerCase(item.title);

  //   console.log(searchededtopic)
  //   if(searchededtopic===requestedtopic){
  //     const postcontent = item.post
  //     const postheading = _.upperFirst(searchededtopic);
  //     res.render("post" ,{heading:postheading , Content:postcontent })
  //   }
  // })
});

const port = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://priyank-verma:Priyank7080@cluster0.7tqzmo5.mongodb.net/postDB",
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(port, function () {
      console.log("Server started on port " + port);
    });
  }).catch((e)=> console.log(e));
