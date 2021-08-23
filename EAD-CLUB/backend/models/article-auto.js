const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const articleAutoSchema = mongoose.Schema({
  name : { type : String , required : true },
  sequence_value : { type : Number , required : true }
});

articleAutoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('articleauto',  articleAutoSchema);
