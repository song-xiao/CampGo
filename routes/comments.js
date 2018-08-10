var express = require("express");
var router  = express.Router({mergeParams: true});    // merge route prefix to access params.id  
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create
router.post("/",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               // add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               // save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// Comments Edit
router.get("/:comment_id/edit", checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, comm){
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment:comm});
        }
    });
});

// Comments Update
router.put("/:comment_id", checkCommentOwnership, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comm){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id)
       };
   }); 
});

// Comments Destroy
router.delete("/:comment_id", checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

function checkCommentOwnership (req, res, next) {
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
}

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;