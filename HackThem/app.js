require('dotenv').config();
const  mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const express= require('express')
const ejs= require('ejs')
const md5=require("md5")
const bodyParser=require('body-parser')
const app = express()
app.use((bodyParser.urlencoded({
    extended:true
  })))
console.log(process.env.SECRET)
app.set('view engine','ejs');
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})
app.get("/",function (req,res) {
  res.render("home");
})

app.get("/register",function (req,res) {
  res.render("register")

})

let userSchema=  new mongoose.Schema({
  email :String,
  password: String
})
// const secret="Thisisourlittlesecret."


// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]})

const User= mongoose.model("User",userSchema);

app.post("/login",function (req,res) {
  User.findOne({email:req.body.username},function (err,foundUser) {
    if(foundUser){
    if(foundUser.password==req.body.password){
       res.render("secrets",{usersWithSecrets: []})
      }
    else{
      res.send("Wrong password")
    }
    }
    else{
      res.send("No user found");
    }

  })


})


app.post("/register",function (req,res) {
  console.log(req.body.username)
  console.log(req.body.password)
  let user = new User({
    email : req.body.username,
    password: md5(req.body.password)
  })
  user.save(function (err) {
    if(!err){
      res.render("secrets",{usersWithSecrets:[]});
    }
    else{
      console.log(err);
    }

  })

})

app.get("/login",function (req,res) {
  res.render("login")

})

app.listen(3000,function (req,res) {
  console.log("started");

})

