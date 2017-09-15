var express=require("express");
var hikespot=require("../models/hikespot");
var middleware=require("../middleware");
var router=express.Router({mergeParams:true});

router.get("/",function(req, res){
    hikespot.find({},function(err, hikespots){
        if(err){
           req.flash("error","Something went wrong");
        }
        res.render("display",{hikespots:hikespots});
    });
});


router.get("/new",middleware.isLoggedIn,function(req, res){
    res.render("newspot");    
});


router.post("/",middleware.isLoggedIn,function(req, res){
    hikespot.create(req.body.hikesite,function(err, hikesite){
      if(err){
          console.log("Hike Spot not added to DB");
        } 
      else{
          hikesite.author.id=req.user._id;
          hikesite.author.name=req.user.username;
          hikesite.save();
          res.redirect("/hikespots");
      }
    });
});


router.get("/:id",middleware.isLoggedIn,function(req, res){
    var id=req.params.id;
    hikespot.findById(req.params.id).populate("comments").exec(function(err, foundHikeSpot){
       if(err){
           console.log("Could not display camp page");
       } 
       else{
           res.render("hikespotpage",{hikesite:foundHikeSpot});
       }
    });
});


//Edit Hikespot route
router.get("/:id/edit",middleware.checkOwnership,function(req, res){
    hikespot.findById(req.params.id,function(err, foundHikeSpot){
        if(err){
            res.render("/hikespots");
        }
        else{
            res.render("edit",{hikesite:foundHikeSpot});
        }
    });
});



//Update Hikespot  route
router.put("/:id",middleware.checkOwnership,function(req, res){
    var id=req.params.id;
    hikespot.findByIdAndUpdate(id,req.body.hikesite,function(err, editedHikeSpot){
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
    hikespot.findByIdAndRemove(id,function(err){
       if(err){
           res.redirect("/hikespots");
       } 
       else{
           res.redirect("/hikespots")
       }
    });
});

     
module.exports=router;