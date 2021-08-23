const Record = require('../models/profile-object');
const registerDetails = require('../models/data-object');
const multer = require("multer");
const express = require("express");
const fs = require("fs");

const router = express.Router();

let user_img_name,user_img_ext,isValidImage;
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const imageStorage = multer.diskStorage({
  destination: (req,file,callback) => {
    //console.log(file,MIME_TYPE_MAP[file.mimetype]);
    isValidImage = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if(isValidImage){
      user_img_ext = file.mimetype;
      error = null;
    }
    callback(error,"images"); //path should be relative to server.js file
  },
  filename: (req,file,callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    let ext = MIME_TYPE_MAP[file.mimetype];
    user_img_name = req.body.name+'.'+ ext;
    callback(null,user_img_name);
  }
});

router.get("/getProfile/:email",(req,res) => {
  Record.findOne({email: req.params.email}).then( userProfile => {
    if(userProfile){
      //console.log(userProfile);
      res.status(200).json(userProfile);
    }else{
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

router.post("/setProfile",multer({storage:imageStorage}).single("image"),(req,res) => {
  Record.findOneAndUpdate(
    { email : req.body.email },
    {
      name: req.body.name,
      dob: req.body.dob,
      gender: req.body.gender,
      country: req.body.country,
      interests: req.body.interests
    }).catch(err => console.error(`Hey! Failed to update String details profile: ${err}`));

  if(isValidImage)
    Record.findOneAndUpdate(
      { email : req.body.email },
      {
        image: fs.readFileSync(__dirname + '\\..\\images\\' + user_img_name),
        imageType: user_img_ext,
      }).catch(err => console.error(`Hey! Failed to update profile Image : ${err}`));

  if(req.body.subscribe!="null")
    Record.findOneAndUpdate(
      { email : req.body.email },
      {
        subscribe: req.body.subscribe
      }).catch(err => console.error(`Hey! Failed to update Subscription: ${err}`));

  res.status(200).json("Profile Updated Successfully!!!");
});

router.get("/deleteAccount/:email",(req,res) => {
  Record.deleteOne({email: req.params.email}).then( () => {
    registerDetails.deleteOne({email: req.params.email}).then(() => {
      res.status(200).json("Account Deleted !!!");
    });
  });
});

module.exports = router;
