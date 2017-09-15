var mongoose=require("mongoose");
mongoose.Promise=global.Promise;


var campgroundSchema=new mongoose.Schema({
   author:{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"user"
      },
      name:String
   },
   name:String,
   image:String,
   description:String,
   comments:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"comment"
   }]
});


var campground=mongoose.model("campground",campgroundSchema);

module.exports=campground;