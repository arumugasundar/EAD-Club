const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const articlesSchema = mongoose.Schema({
  aid : { type : Number , required : true },
  title : { type : String , required : true },
  tag : { type : String , required : true },
  description : { type : String , required : true },
  image: {type: Buffer, default: null},
  imageType : {type: String, default: null},
  quote : { type : String , required : true },
  auid : { type : Number , required : true },
  time : { type : Date , required : true }
});

articlesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('article', articlesSchema);
