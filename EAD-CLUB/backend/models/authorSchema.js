const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const authorSchema = mongoose.Schema({
  auid : { type : Number , required : true },
  name : { type : String , required : true },
  description : { type : String , required : true },
  image: {type: Buffer, default: null},
  imageType : {type: String, default: null},
});

authorSchema.plugin(uniqueValidator);
module.exports = mongoose.model('author', authorSchema);
