const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const discussFlags = mongoose.Schema({
  aid : { type : Number , required:true },
  uid : { type : Number , required:true },
  cid : { type : Number , required:true },
  upvote : { type : Boolean , required : true },
  downvote : { type : Boolean , required : true },
});

discussFlags.plugin(uniqueValidator);
module.exports = mongoose.model('discussflag',  discussFlags);
