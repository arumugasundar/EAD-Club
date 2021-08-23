const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const discussAutoSchema = mongoose.Schema({
  aid : { type : Number , required:true },
  sequence_value : { type : Number , required : true }
});

discussAutoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('discussauto',  discussAutoSchema);
