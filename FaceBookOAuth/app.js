require('dotenv').config();
const express= require('express')
const bodyParser=require('body-parser')
const ejs= require('ejs')
const  mongoose = require('mongoose')
const  session = require('express-session')
const passport = require('passport')
const passportLocalMongoose= require('passport-local-mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate=require('mongoose-findorcreate')
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
  password: String,
    googleId: String,
    facebookId: String,
    secret: String
})
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// const secret="Thisisourlittlesecret."


// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]})

const User= mongoose.model("User",userSchema);

passport.use(User.createStrategy())
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/secrets",
        profileFields: ['id', 'displayName', 'photos', 'email']

    },
    function(accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));
//
// app.get("/", function(req, res){
//     res.render("home");
// });


app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
    passport.authenticate('google', { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect to secrets.
        res.redirect("/secrets");
    });

app.get('/auth/facebook',
    passport.authenticate('facebook',{ scope: ['user_friends', 'public_profile','email','pages_show_list','read_insights'] }));

app.get('/auth/facebook/secrets',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/secrets');
    });

app.post("/login",function (req,res) {
        const user = new User({
            username: req.body.username,
            passowrd: req.body.password
        });
       req.login(user,function (err) {
           if(err){
               // console.log(err);
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
        // console.log(err);
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
  // if(req.isAuthenticated()){
    User.find({"secret":{$ne: null}}, function (err, foundUsers) {
        if(err){
            console.log("error");
        }
        else{
            res.render("secrets",{usersWithSecrets:foundUsers})
        }

    })
  // res.render("secrets",{usersWithSecrets: []})
  // }
  // else{
  //   res.redirect("/login")
  // }

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

app.get("/submit",function (req,res) {
    if(req.isAuthenticated()){
        res.render("submit");
    }
    else{
        res.render("/login")
    }

})

app.post("/submit", function (req,res) {
    const submittedSecret = req.body.secret;
    console.log(req.user);
    User.findById(req.user.id, function (err,foundUser) {
        if(err){
            console.log('er');
        }
        else{
            foundUser.secret=submittedSecret;
            foundUser.save(function () {
                res.redirect("/secrets");
            });
        }

    })
})