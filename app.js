require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const contents = [];
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://priyank-verma:Priyank7080@cluster0.7tqzmo5.mongodb.net/postDB",
  { useNewUrlParser: true }
);
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

app.listen(port, function () {
  console.log("Server started on port " + port);
});
