require('dotenv').config();
const  mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const express= require('express')
const ejs= require('ejs')
const  session = require('express-session')
const passport = require('passport')
const passportLocalMongoose= require('passport-local-mongoose')

const bodyParser=require('body-parser')
const app = express()
app.use((bodyParser.urlencoded({
    extended:true
  })))
console.log(process.env.SECRET)
app.set('view engine','ejs');
app.use(express.static("public"))
app.use(session(
    {
        secret: "Out little Secret.",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.initialize());
app.use(passport.session());



mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})
mongoose.set("useCreateIndex",true)
// app.get("/",function (req,res) {
//   res.render("home");
// })

app.get("/register",function (req,res) {
  res.render("register")

})

let userSchema=  new mongoose.Schema({
  email :String,
  password: String
})
userSchema.plugin(passportLocalMongoose);
// const secret="Thisisourlittlesecret."


// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]})

const User= mongoose.model("User",userSchema);

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.post("/login",function (req,res) {
        const user = new User({
            username: req.body.username,
            passowrd: req.body.password
        });
       req.login(user,function (err) {
           if(err){
               console.log(err);
               res.redirect("/register")
           }
           else{
               passport.authenticate("local")(req,res,function () {
                   res.redirect("/secrets")
               })
           }
       })
})


app.post("/register",function (req,res) {
   User.register({username: req.body.username}, req.body.password, function (err, user) {
      if(err){
        console.log(err);
        res.redirect("/register")
      }
      else{
        passport.authenticate("local")(req,res,function () {
          res.redirect("/secrets")
        })
      }
   })
})


app.get("/secrets",function (req,res) {
  if(req.isAuthenticated()){
  res.render("secrets",{usersWithSecrets: []})
  }
  else{
    res.redirect("/login")
  }

})



app.get("/",function (req,res) {
    if(req.isAuthenticated()){
        console.log("authed");
        res.render("secrets",{usersWithSecrets: []})
    }
    else{
        res.redirect("/login")
    }

})

app.get("/login",function (req,res) {
  res.render("login")

})


app.get("/logout",function (req,res) {
    req.logout()
    res.redirect("/")

})


app.listen(3000,function (req,res) {
  console.log("started");

})

