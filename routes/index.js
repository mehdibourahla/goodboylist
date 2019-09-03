var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/user');
var passport = require('passport');
var middleware = require('../middleware');

router.get("/",function(req,res){
    res.render("landing");
});

router.get("/register",middleware.canLog,function(req,res){
    res.render("register");
});

router.post("/register",middleware.canLog,function(req,res){
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/login");
        });   
    });
});

router.get("/login",middleware.canLog,function(req,res){
    res.render("login");
});

router.post('/login',middleware.canLog,passport.authenticate("local",{
    successRedirect: "/todos",
 	failureRedirect: "/login"
}),function(req,res){
});

router.get("/logout",middleware.isLoggedIn,function(req,res){
    req.logout(); //Tells passport to erase all data we have in this session
    res.redirect('/todos') //Redirect
});

module.exports = router;