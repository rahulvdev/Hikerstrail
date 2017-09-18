var express=require("express");
var hikespot=require("../models/hikespot");
var middleware=require("../middleware");
var geocoder=require("geocoder");
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
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      name: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newHikeSpot = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    hikespot.create(newHikeSpot, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to Hike Spots page
            res.redirect("/hikespots");
        }
    });
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
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, location: location, lat: lat, lng: lng};
    hikespot.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, hikesite){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/hikespots/" + hikesite._id);
        }
    });
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