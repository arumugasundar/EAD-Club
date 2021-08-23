const express = require("express");
const router = express.Router();
const Article = require('../models/articlesSchema')

/* article get by recent date */
router.get( '/recent' ,  (req ,res )=> {
  Article.find({tag:"Recent"} ,(error,user)=>{
    if( error ){
      console.log("Error in All Article Fetch :  "+error )
      res.status(401).send("Error in recent")
    }
    else{
      console.log("News Articles Recent Fetched Successfully : "+user)
      Article.find({tag:"Team"} ,(error,user1)=>{ //tag : "Team"
        if( error ){
          console.log("Error in All Article Fetch :  "+error )
          res.status(401).send("Error in featured")
        }
        else{
          console.log("News Articles featured Fetched Successfully")
          Article.find({tag:"Local"} ,(error,user2)=>{ //tag : "local"
            if( error ){
              console.log("Error in All Article Fetch :  "+error )
              res.status(401).send("Error in local")
            }
            else{
              console.log("News Articles usual Fetched Successfully")
              res.status(200).send( [user , user1 , user2 ] )
            }
          }).sort( {"time": -1} ).limit(1)
          /* article get by usual ends */
        //  res.status(200).send( user1 )
        }
      }).sort( {"time": -1} ).limit(1)
      /* article get by featured ends */

      //res.status(200).send( user )
    }
  }).sort( {"time": -1} ).limit(1)
})
/* article get by recent date ends */

module.exports = router;
