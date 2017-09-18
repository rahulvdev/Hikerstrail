var express=require("express");
var app=express();
var flash=require("connect-flash");
var passport=require("passport");
var localStrategy=require("passport-local");
var expressSession=require("express-session");
var user=require("./models/user");
var body_parser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var hikeRoute=require("./routes/hikeRoutes");
var commentRoute=require("./routes/commentRoutes");
var authRoute=require("./routes/authRoutes");
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost/hikerstrail",{useMongoClient: true});

app.set("view engine", "ejs");
app.use(body_parser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//Passport configuration
app.use(expressSession({
    secret:"Fc Barcelona is the best club in the world",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


//Middleware to pass user info to each template
app.use(function(req, res, next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//Routes
app.use("/hikespots",hikeRoute);
app.use("/hikespots/:id/comments",commentRoute);
app.use(authRoute);

//Root route
app.get("/",function(req, res){
    res.render("landing");
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started");
});