const express = require("express");
const router = express.Router();
const Article = require('../models/articlesSchema');
const Increment = require('../models/article-auto');
const ArticleOne = require('../models/authorSchema');
const DiscussAuto = require('../models/discuss-auto')
const jwt = require("jsonwebtoken");

/* Image Handling Starts */
const multer = require("multer");
const fs = require("fs");

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
    callback(error,"EAD-CLUB\\backend\\images"); //path should be relative to server.js file
  },
  filename: (req,file,callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    let ext = MIME_TYPE_MAP[file.mimetype];
    user_img_name = name + '.'+ ext;
    callback(null,user_img_name);
  }
});
/* Image Handling Ends */

/* Token Verifier */
function verifyToken( req , res , next ) {
  if( !req.headers.authorization ){
    return res.status(401).send( "Unauthorized request ")
  }
  //console.log( req )
  let token = req.headers.authorization.split(' ')[1]
  if( token === 'null' )
  {
    return res.status(401).send( "Unauthorized req ")
  }
  let payload = jwt.verify( token,'secretKey')
  //console.log( "Payload is : " + payload )
  if( !payload ){
    return res.status(401).send( "Unauthorized user ")
  }
  req.userId = payload.subject
  //console.log( " id is :" + payload.subject )
  next()
}
/* END Token Verifier */

/* article data handlers*/
/* article get by date */
router.get( '/articles' , verifyToken ,(req ,res )=> {
    Article.find({ } ,(error,user)=>{
    if( error ){
      console.log("Error in All Article Fetch :  "+error )
    }
    else{
          console.log("Articles Fetched Successfully")
          res.status(200).send( user )
    }
  }).sort( {"time": -1} )
})
/* article get by date ends */
/* article post Data */
function insertArticle( req , res ){
  let seq_val = 0;
  console.log("Insert Called")
  Increment.findOne({name:"pranesh"}).then(result => {
    if( result ) {
      console.log(`Successfully found document: ${result}.`);
      var str = JSON.stringify(result);
      var myarray = str.split(':');
      var seq = myarray[2].split(',');
      console.log('Value is :  ' + seq[0]);
      if( seq[0] )
      {
        Increment.findOneAndUpdate({ name : "pranesh" }, { sequence_value : parseInt(seq[0]) + 1 } )
          .then(updatedDocument => {
            if(updatedDocument) {
              console.log(`Successfully updated document: ${updatedDocument}.`)
              seq_val =  parseInt( seq[0] ) + 1
              console.log("Inside insertUser" +  seq_val + req + res )
              if (seq_val) {
                const user = new Article({
                  aid: seq_val,
                  title: req.body.title,
                  tag : req.body.tag,
                  description : req.body.description,
                  image: fs.readFileSync(__dirname + '\\..\\images\\' + user_img_name),
                  imageType: user_img_ext,
                  quote : req.body.quote,
                  time : Date.now(),
                  auid : req.body.auid
                });

                user.save((error, articleReg) => {
                  if (error) {
                    console.log(error)
                    res.status(401).send(error.error)
                  } else {
                    //res.status(200).send("Article Inserted Successfully "+articleReg)
                    //res.status(200).json("New Article Created!!!")
                    const art = new DiscussAuto({
                      sequence_value : 0,
                      aid : seq_val
                    })
                    art.save((error, articleReg) => {
                      if (error) {
                        console.log(error)
                        res.status(401).send(error.error)
                      }
                      else{
                        console.log("Added a auto increment for discussion")
                        res.status(200).json("Article Inserted Successfully ");
                      }
                    })
                    //res.status(200).json("Article Inserted Successfully ");
                  }
                })
              }
            } else {
              console.log("No document matches the provided query.")
            }
          })
          .catch(err => console.error(`Failed to find and update document: ${err}`))
      }
    } else {
      console.log("No document matches the provided query.");
    }
  }) .catch(err => console.error(`Failed to find document: ${err}`));
}

router.post("/articlesInsert", multer({storage:imageStorage}).single("image"), (req, res, next) => {
  console.log("In article.js",req.body);
  insertArticle( req , res )
  //res.status(200).send("Success Call")
});
/* article post Data Ends*/

/* Fetch one Article and Author */
router.post( "/articlesOne" , verifyToken , (req, res) => {
  let id = req.body
  //console.log( " id is : " + id + id.aid )
  Article.find({ aid : id.aid },(error,user)=>{
    if( error ){
      console.log("Error in FetchOne Article :  "+error )
    }
    else{
      if( !user ){
        res.status(401).send( "Unable to fetch data")
      }
      else {
        console.log("ArticleOne author Fetched Successfully")
        let auid_ = 1;
        ArticleOne.find({auid : auid_ },(error,auth)=>{
          if( error ){
            console.log("Error in FetchOne Article :  "+error )
          }
          else {
            if( !auth ){
              res.status(401).send( "Unable to fetch author")
            }
            else{
              //console.log( user , auth )
              res.status(200).send( [user,auth] )
            }
          }
        })
      }
    }
  })//.catch( error )=> console.log( error.message())
});
/* Fetch one Article and Author Ends*/

/* article data handlers Ends*/
module.exports = router;
