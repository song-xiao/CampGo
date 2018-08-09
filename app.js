var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment   = require("./models/comment");
    // seedDB = require("./seeds");
    
mongoose.connect("mongodb://localhost/go_camp");
// seedDB();
// Campground.create(
//     { name: "Narin Falls", 
//       image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906_1280.jpg",
//       description: "This is a medium campground with Narin Falls in walking distance. You can reach Whistler and Pemberton in half an hour drive."
//     },function(err,camp){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Newly created camp");
//             console.log(camp);
//         }
//     }
// );

// Arbitrary campgrounds
// var campgrounds = [
//     { name: "Porteau Cove", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022_1280.jpg"},
//     { name: "Narin Falls", image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906_1280.jpg"},
//     { name: "Cultus Lake", image: "https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275_1280.jpg"},
//     { name: "Alice Lake", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"}
//     ];

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.get("/",function(req,res){
   res.render("landing"); 
});

// INDEX - show all campgrounds
app.get("/campgrounds",function(req,res){
    // get all campgrounds from DB
    Campground.find({},function(err,camps){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:camps})
        }
    });
});

// CREATE - add new campground to DB
app.post("/campgrounds",function(req,res){
    // get data from form to add campsite
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = {
        name: name,
        image: image,
        description: desc
    };
    // create a new campground and save to DB
    Campground.create(newCamp, function(err,camp){
            if (err){
                console.log(err);
            } else {
                // redirect back to campground page
                res.redirect("/campgrounds");
            }
        }
    );
});

// NEW - show form to create new campground
app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/new");
});

// SHOW - show more info of one campground
app.get("/campgrounds/:id", function(req,res){
    // find the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
       if (err) {
           console.log(err);
       } else {
           // render show template with the campground
           res.render("campgrounds/show", {campground:foundCamp});
       }
    });
    
});

// ===================
// COMMENTS ROUTES
// ===================

app.get("/campgrounds/:id/comments/new",function(req,res){
    // find campground by id
    Campground.findById(req.params.id,function(err,camp){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:camp}); 
        }
    });
});

app.post("/campgrounds/:id/comments",function(req,res){
    // lookup campground by id
    Campground.findById(req.params.id,function(err,camp){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err,comment){
               if (err){
                   console.log(err);
               } else {
                   // add comment to campground
                   camp.comments.push(comment);
                   camp.save();
                   // redirect to campground show page
                   res.redirect("/campgrounds/" + camp._id);
               }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("app starts!");
});