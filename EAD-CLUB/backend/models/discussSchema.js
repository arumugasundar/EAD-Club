const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const discussSchema = mongoose.Schema({
  aid : { type : Number , required:true },
  values : {
    cid : { type : Number , required:true },
    uid : { type : Number , required:true },
    name: { type: String, required: true },
    email: {type: String, required: true },
    comment : { type: String, required: true },
    upvote : { type : Number , required:true },
    downvote : { type : Number , required:true },
    time : { type : Date , required : true }
  }
});

discussSchema.plugin(uniqueValidator);
module.exports = mongoose.model('discus', discussSchema);
