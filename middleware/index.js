var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, camp){
           if (err) {
               res.redirect("back");
           } else {
               // does the user own the campground. Use equals instead of '===''
               if (camp.author.id.equals(req.user._id)){
                    next();  
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        // take user back to previous page
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, comm){
           if (err) {
               res.redirect("back");
           } else {
               // does the user own the comment. 
               if (comm.author.id.equals(req.user._id)){
                    next();
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        // take user back to previous page
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;