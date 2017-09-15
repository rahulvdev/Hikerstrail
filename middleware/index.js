var campground=require("../models/campground");
var comment=require("../models/comment");
var middlewareObj={};

middlewareObj.checkOwnership=function (req, res, next){
        if(req.isAuthenticated()){
            campground.findById(req.params.id,function(err, foundCamp){
                if(err){
                    req.flash("error","Campground not found");
                    res.redirect("back");
                }
                else{
                    if(foundCamp.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error","You do not have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error","Please login first");
            res.redirect("/login");
        }
}


middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please log in first");
    res.redirect("/login");
}


middlewareObj.checkCommentOwnership=function(req, res, next){
        if(req.isAuthenticated()){
            comment.findById(req.params.comment_id,function(err, foundComment){
                if(err){
                    req.flash("error","Comment not found");
                    res.redirect("/hikespots");
                }
                else{
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error","You do not have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error","Please log in first");
            res.redirect("/login");
        }
}



module.exports=middlewareObj;