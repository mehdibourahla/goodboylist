var passportLocalMongoose = require('passport-local-mongoose'),
LocalStrategy             = require('passport-local'),
passport                  = require('passport'),
methodOverride            = require('method-override'),
todosRoutes               = require('./routes/todos'),
indexRoutes               = require('./routes/index'),
bodyParser                = require('body-parser'),
User                      = require('./models/user'),
mongoose                  = require('mongoose'),
express                   = require('express'),
app                       = express();


app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

var url = process.env.DATABASEURL || "mongodb://localhost/todo"
mongoose.connect(url, {useNewUrlParser: true});

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

var PORT = process.env.PORT || 3000 ;
app.listen(PORT,process.env.IP,function(){
    console.log("Server ON");
});