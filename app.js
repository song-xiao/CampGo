var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment   = require("./models/comment"),
    User = require("./models/user");
    // seedDB = require("./seeds");
    
mongoose.connect("mongodb://localhost/go_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

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

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("app starts!");
});