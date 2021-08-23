const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const authorAutoSchema = mongoose.Schema({
  name : { type : String , required : true },
  sequence_value : { type : Number , required : true }
});

authorAutoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('authorauto',  authorAutoSchema);
