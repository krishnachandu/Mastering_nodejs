//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose= require('mongoose');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// DB Stuff Start:

 mongoose.connect("DB URL", {useNewUrlParser:true, useUnifiedTopology: true })
let postSchema=  mongoose.Schema({
  title:String,
  content:String
})

let Post= mongoose.model("post",postSchema)
let About = mongoose.model("about",postSchema)
let Contact = mongoose.model("contact",postSchema)

// DB Stuff End:



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  Post.find(function (err,postsList) {
    if(postsList.length==0){
      console.log(postsList)
      let p=new Post({"title":"home","content":homeStartingContent})
      p.save()
      res.redirect("/")
    }
    else{
      console.log(postsList)
      res.render("home", {
        posts: postsList
      });
    }

  })

});

app.get("/about", function(req, res){

  About.findOne({"title":"about"},function (err,postsList) {
    if(!postsList){
      console.log(postsList)
      let p=new About({"title":"about","content":aboutContent})
      p.save(function(err){
        if (!err){
          res.redirect("/about");

        }
      });
    }
    else{
      console.log(postsList)
      res.render("about", {aboutContent: postsList.content});
    }

  })

});

app.get("/contact", function(req, res){
  Contact.findOne({"title":"contact"},function (err,contactData) {
    if(!contactData){
      console.log(contactData)
      let p=new Contact({"title":"contact","content":contactContent})
      p.save(function(err){
        if (!err){
          res.redirect("/contact");

        }

      });
    }
    else{
      console.log(contactData)
      res.render("contact", {contactContent: contactData.content});

    }

  })
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const requestedTitle = _.lowerCase(req.body.postTitle);
  let p=new Post({"title":requestedTitle,"content":req.body.postBody})
  p.save()
  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const postId = req.params.postId;
  console.log(postId)

  Post.findOne({"_id":postId},function (err,postsList) {
    if(!postsList){
      res.redirect("/")
    }
    else{
      console.log(postsList)
      res.render("post", {title:postsList.title,content:postsList.content});
    }

  })



  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
  //
  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
