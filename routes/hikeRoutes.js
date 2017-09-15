var express=require("express");
var campground=require("../models/campground");
var middleware=require("../middleware");
var router=express.Router({mergeParams:true});

router.get("/",function(req, res){
    campground.find({},function(err, campgrounds){
        if(err){
           req.flash("error","Something went wrong");
        }
        res.render("display",{campgrounds:campgrounds});
    });
});


router.get("/new",middleware.isLoggedIn,function(req, res){
    res.render("newcamp");    
});


router.post("/",middleware.isLoggedIn,function(req, res){
    campground.create(req.body.campsite,function(err, camp){
      if(err){
          console.log("Camp not added to DB");
        } 
      else{
          camp.author.id=req.user._id;
          camp.author.name=req.user.username;
          camp.save();
          res.redirect("/hikespots");
      }
    });
});


router.get("/:id",middleware.isLoggedIn,function(req, res){
    var id=req.params.id;
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log("Could not display camp page");
       } 
       else{
           res.render("campgroundpage",{camp:foundCampground});
       }
    });
});


//Edit campground route
router.get("/:id/edit",middleware.checkOwnership,function(req, res){
    campground.findById(req.params.id,function(err, foundCamp){
        if(err){
            res.render("/hikespots");
        }
        else{
            res.render("edit",{camp:foundCamp});
        }
    });
});



//Update campground route
router.put("/:id",middleware.checkOwnership,function(req, res){
    var id=req.params.id;
    campground.findByIdAndUpdate(id,req.body.campsite,function(err, editedCampgound){
       if(err){
           res.redirect("/hikespots/"+id);
       } 
       else{
           res.redirect("/hikespots/"+id);
       }
    });
});

router.delete("/:id",middleware.checkOwnership,function(req, res){
    var id=req.params.id;
    campground.findByIdAndRemove(id,function(err){
       if(err){
           res.redirect("/hikespots");
       } 
       else{
           res.redirect("/hikespots")
       }
    });
});

     
module.exports=router;