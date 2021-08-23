const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const profileSchema = mongoose.Schema({
  uid : { type : Number , required:true },
  name: { type: String, required: true },
  email: {type: String, required: true , unique: true },
  imageUrl: {type: String},
  date_of_birth: {type: Date},
  gender: {type: String},
  interests : {type: String},
  subscribe: {type: Boolean}
});

profileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('profile', profileSchema);
