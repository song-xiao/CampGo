var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/go_camp");

// setup scheme
var campgroundScheme = new mongoose.Schema({
    name: String,
    image: String
});

// setup model
var Campground = mongoose.model("Campground",campgroundScheme);
    
// Campground.create(
//     { name: "Narin Falls", image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906_1280.jpg"
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

app.get("/",function(req,res){
   res.render("landing"); 
});

app.get("/campgrounds",function(req,res){
    // get all campgrounds from DB
    Campground.find({},function(err,camps){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds:camps})
        }
    });
});

app.post("/campgrounds",function(req,res){
    // get data from form to add campsite
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = {
        name: name,
        image: image
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

app.get("/campgrounds/new",function(req, res){
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("app starts!");
})