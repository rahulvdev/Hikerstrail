var express=require("express");
var app=express();
var mongoose=require("mongoose");


mongoose.connect("mongodb://localhost/yelpcamp")

var campgroundArr=[{ 
   author:"Rahul Vijaydev",
   name:"Yosemite National Park, California",
   image:"https://lovelace-media.imgix.net/uploads/20/2b3a7b30-b600-0131-92da-76123c8e5fa3.jpg?w=480&h=324&fit=crop&crop=faces&auto=format&q=70&dpr=2",
   description:"Ninety-five percent of Yosemite National Park is designated wilderness, which means no cars, no buildings, and no electricity. Sleep under the stars and hike up to Glacier Point for a view of Yosemite Valley, Half Dome, and Yosemite Falls. Make sure you store your food properly though — black bears are common!"},
   { 
   author:"Rahul Vijaydev",
   name:"Shenandoah National Park, Virginia",
   image:"https://lovelace-media.imgix.net/uploads/20/2c77d6f0-b605-0131-4925-0eb5cee09ce1.jpg?w=480&h=320&fit=crop&crop=faces&auto=format&q=70&dpr=2",
   description:"Conveniently located just 75 miles from Washington, D.C., Shenandoah National Park makes for the perfect nature retreat. You'll find 101 miles of the Appalachian Trail and just overall peaceful, wild beauty. Hike away the weekend among the park's many waterfalls."},
   {
   author:"Rahul Vijaydev",
   name:"Boya Lake Provincial Park, Canada",
   image:"https://lovelace-media.imgix.net/uploads/20/2c716550-b605-0131-568e-023a6d66c206.jpg?w=480&h=360&fit=crop&crop=faces&auto=format&q=70&dpr=2",
   description:"Boya Lake Provincial Park, renowned for the color and clarity of its lake, is a great place to enjoy any type of water recreation. The lake is also one of the few in the north that's warm enough for swimming. The area was carved out by glaciers, leaving many islands and lakes behind for modern campers to explore on the park's hiking trails."},
   { 
   author:"Rahul Vijaydev",
   name:"Big Sur, California",
   image:"https://lovelace-media.imgix.net/uploads/20/c412ead0-b605-0131-62dd-06fb61bcfb52.jpg?w=480&h=319&fit=crop&crop=faces&auto=format&q=70&dpr=2",
   description:"Famous around the world, Big Sur, with its wide selection of campsites, is bound to make anyone a happy camper. Pitch your tent deep among the redwoods, stream side, or right by the ocean."},
   {
   author:"Rahul Vijaydev",
   name:"The Isle of Arran, Scotland",
   image:"https://lovelace-media.imgix.net/uploads/20/2a1a68c0-b607-0131-c1eb-1ea9a094ffb8.jpg?w=480&h=318&fit=crop&crop=faces&auto=format&q=70&dpr=2",
   description:"Not only is the Isle of Arran beautiful, but it's also full of history — as in, it's been inhabited since prehistory. The island has a wide variety of landscapes and seascapes, including rugged mountains and rolling hills. Campers can hike, sail, kayak, or cycle around the island."
   }];

var campgroundSchema=new mongoose.Schema({
   author:String,
   name:String,
   image:String,
   description:String,
   comments:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"comment"
   }]
});

var campground=mongoose.model("campground",campgroundSchema);


campground.remove({},function(err){
    if(err){
        console.log("Could not remove campgrounds from database");
    }
    else{ 
        campgroundArr.forEach(function(camp){
            campground.create(camp,function(err, camp){
                if(err){
                    console.log("Could not save camp to DB");
                } 
                else{
                    console.log(camp);
                }
            });
        });
    }
});


