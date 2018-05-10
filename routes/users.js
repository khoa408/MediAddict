var express = require("express");
var router  = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("../models/user");
var Entry = require("../models/entry");
var config = require('../config');

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar,
        isAdmin: false
      });

    // if(req.body.adminCode === 'secretcode123') {
    //   newUser.isAdmin = true;
    // }

    User.register(newUser, req.body.password, function(err, user){
        if(err){    
            console.log(err);
            if (err && err.code === 11000) {
              err.message = "Email is already used for another account.";
            }
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/search"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", 
  
  function(req, res, next) {
      if (req.body.rememberMe) {
        req.session.cookie.maxAge = config.cookieMaxAge;
      }
      next();
    },

  passport.authenticate("local", 
    {
        successRedirect: "/search",
        failureRedirect: "/users/login",
        failureFlash: true,
        successFlash: 'Welcome to Mediaddict!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   req.session.destroy();  

   //var successM= {message:"Successfully logged out."};
    res.redirect("/search");
});

// USER PROFILE
router.get("/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Entry.find().where('author.id').equals(foundUser._id).exec(function(err, entries) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: foundUser, entries: entries});
    })
  });
});




passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


module.exports = router;
