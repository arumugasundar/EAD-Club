const multer = require("multer");
const express = require("express");
const Record = require('../models/authorSchema');
const fs = require("fs");
const Increment = require('../models/author-auto');

const router = express.Router();

/* validate and store image in local folder starts */
let user_img_name,user_img_ext,isValidImage;
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const imageStorage = multer.diskStorage({
  destination: (req,file,callback) => {
    isValidImage = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if(isValidImage){
      user_img_ext = file.mimetype;
      error = null;
    }
    callback(error,"EAD-CLUB\\backend\\images"); //path should be relative to server.js file
  },
  filename: (req,file,callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    let ext = MIME_TYPE_MAP[file.mimetype];
    user_img_name = req.body.name+'.'+ ext;
    callback(null,user_img_name);
  }
});
/* validate and store image in local folder ends */

/* Create Author starts */
router.post(
  "/createAuthor",
  multer({storage:imageStorage}).single("image"),
  (req,res) => {
    console.log( "Author inserted")
    Increment.findOne({name:"pranesh"}).then(result => {
      if( result ) {
        console.log( "Author auto inc called and result retured")
        const num = parseInt(result.sequence_value);
        if(num){
          const user = new Record({
            auid: num,
            name: req.body.name,
            description: req.body.description,
            image: fs.readFileSync(__dirname + '\\..\\images\\' + user_img_name),
            imageType: user_img_ext,
          });

          user.save((error) => {
            if(error)
              console.log("Inserting Author Fail");
            else{
              console.log("Inserting Author Success");
              Increment.findOneAndUpdate({ name : "pranesh" }, { sequence_value : num + 1 } )
                .then(() =>{
                  console.log("Updating Author Id, after Author Insertion.");
                  res.status(200).json("New Author Created!!!")
                }).catch(err => console.error(`Hey! Failed to increment author id: ${err}`));
            }
          }).catch(err => console.error(`Hey! Failed to insert Author: ${err}`))
        }
      }
    }).catch(err => console.error(`Hey! Failed to fetch author id: ${err}`));
  }
);
/* Create Author ends */

module.exports = router;
