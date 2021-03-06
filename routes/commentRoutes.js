var express=require("express");
var hikespot=require("../models/hikespot");
var comment=require("../models/comment");
var middleware=require("../middleware");
var router=express.Router({mergeParams:true});


//Handling comments
router.get("/new",middleware.isLoggedIn,function(req, res){
    var id=req.params.id;
    res.render("comment",{id:id});
});


router.post("/",middleware.isLoggedIn,function(req, res){
    var id=req.params.id;
    hikespot.findById(id,function(err, hikesite){
        if(err){
            console.log("Could not display campground page");
        }
        else{
            var post=req.body.comment;
            comment.create(post,function(err, commentResult){
                if(err){
                    req.flash("error","Could not add comment");
                }
                else{
                   commentResult.author.id=req.user._id;
                   commentResult.author.name=req.user.username;
                   commentResult.save();
                   hikesite.comments.push(commentResult);
                   hikesite.save(function(err){
                    if(err){
                        console.log("Could not save camp object into the database");
                    }
                        req.flash("success","Comment succesfully added");
                        res.redirect("/hikespots/"+hikesite._id);
                 });
               }
            })
         }
     });
});


//Comment edit and delete routes
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req, res){
    var hikespotId=req.params.id;
    var comment_id=req.params.comment_id;
    comment.findById(comment_id,function(err, foundComment){
       if(err){
           req.flash("error","You do not have permission to do that");
            res.redirect("/hikespots/"+req.params.id);
       }
       else{
           res.render("editComment",{
                hikespotId:hikespotId,               
                comment:foundComment});
       }
    });
    
});


router.put("/:comment_id",middleware.checkCommentOwnership,function(req, res){
    var comment_id=req.params.comment_id;
    comment.findByIdAndUpdate(comment_id,req.body.comment,function(err, foundComment){
        if(err){
            res.redirect("/hikespots/"+req.params.id);
        }
        else{
            res.redirect("/hikespots/"+req.params.id);
        }
    });
});


//Comment delete route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req, res){
    var comment_id=req.params.comment_id;
    comment.findByIdAndRemove(comment_id,function(err){
       if(err){
           res.redirect("/hikespots/"+req.params.id);
       } 
       else{
           res.redirect("/hikespots/"+req.params.id);
       }
    });
});



module.exports=router;