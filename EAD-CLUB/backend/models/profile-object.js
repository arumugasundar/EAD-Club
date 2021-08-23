const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const profileSchema = mongoose.Schema({
  uid : { type : Number , required:true },
  name: { type: String, required: true },
  email: {type: String, required: true , unique: true },
  image: {type: Buffer, default: null},
  imageType : {type: String, default: null},
  dob: {type: String, default: null},
  gender: {type: String, default: null},
  country: {type: String, default: null},
  interests : {type: String, default: null},
  subscribe: {type: Boolean, default: false}
});

profileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('profile', profileSchema);
