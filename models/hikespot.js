var mongoose=require("mongoose");
mongoose.Promise=global.Promise;


var hikespotSchema=new mongoose.Schema({
   author:{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"user"
      },
      name:String
   },
   name:String,
   image:String,
   location:String,
   lat:Number,
   lng:Number,
   createdAt: { type: Date, default: Date.now },
   description:String,
   comments:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"comment"
   }]
});


var hikespot=mongoose.model("hikespot",hikespotSchema);

module.exports=hikespot;