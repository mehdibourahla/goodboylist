var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var todosRoutes = require('./routes/todos');
var indexRoutes = require('./routes/index');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport              = require('passport');
var LocalStrategy         = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');


app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
mongoose.connect("mongodb://localhost/todo", {useNewUrlParser: true});

//PASSPORT CONFIGURATION
app.use(require('express-session')({      //Require express-session and telling to express to use it 
	secret: "Something i don't know yet", //We need to fill some data inside
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize()); // We need this two lines
app.use(passport.session());    // Anytime we use passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     //This two methods are used to take(put) data 
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user; //currentUser or whatever you want
    next();
}); // It allows us to get the current user in all routes 
//==========
//ROUTES
//==========

app.use(indexRoutes);
app.use("/todos",todosRoutes);

app.listen(3000,function(){
    console.log("Server ON");
});