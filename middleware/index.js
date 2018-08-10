var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, camp){
           if (err) {
               req.flash("error", "Campground not found!");
               res.redirect("back");
           } else {
               // does the user own the campground. Use equals instead of '===''
               if (camp.author.id.equals(req.user._id)){
                    next();  
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to log in to do that!");
        // take user back to previous page
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, comm){
           if (err) {
               req.flash("error", "Comment not found!");
               res.redirect("back");
           } else {
               // does the user own the comment. 
               if (comm.author.id.equals(req.user._id)){
                    next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You have to log in to do that!");
        // take user back to previous page
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // Flash messages are not displayed until the next page is rendered. Flash message must be placed before redirect.
    // key: error, value: You need to log in to do that!
    req.flash("error", "You need to log in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;