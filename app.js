var express = require("express");
var app = express();
var campgrounds = [
    { name: "Porteau Cove", image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104496f3c67da7eeb6b8_340.jpg"},
    { name: "Narin Falls", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f3c67da7eeb6b8_340.jpg"},
    ];

app.set("view engine","ejs");

app.get("/",function(req,res){
   res.render("landing"); 
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds", {campgrounds:campgrounds})
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("app starts!");
})