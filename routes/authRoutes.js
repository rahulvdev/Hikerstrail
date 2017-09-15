var express=require("express");
var passport=require("passport");
var user=require("../models/user");
var router=express.Router();

router.get("/register",function(req, res){
    res.render("register");
});

router.post("/register",function(req, res){
    var newUser=new user({username:req.body.username});
    user.register(newUser,req.body.password,function(err, registeredUser){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
            passport.authenticate("local")(req, res, function(){
                req.flash("success","Welcome to Hikerstrail,"+registeredUser.username);
                res.redirect("/hikespots");
        });
    });
});

//Login routes
router.get("/login",function(req, res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    successRedirect:"/hikespots",
}),function(req, res){
    
});

router.get("/logout",function(req, res){
    req.logout();
    req.flash("success","You succesfully logged out");
    res.redirect("/hikespots");
});


module.exports=router;