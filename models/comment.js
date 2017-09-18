var mongoose=require("mongoose");
mongoose.Promise=global.Promise;

var commentSchema=new mongoose.Schema({
    post:String,
    createdAt: { type: Date, default: Date.now },
    author:{
          id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"user"
      },
      name:String
    }
});


var comment=mongoose.model("comment",commentSchema);

module.exports=comment;