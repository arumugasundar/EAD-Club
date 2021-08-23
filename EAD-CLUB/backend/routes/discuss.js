const express = require("express");
const Record = require('../models/discussSchema');
const Increment = require('../models/discuss-auto');
//const flags = require('../model/discussVoteFlags');
const router = express.Router();
const jwt = require("jsonwebtoken");

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

/* Fetch Discussion */
router.post( '/discussed' ,  verifyToken , (req ,res )=> {
  let id = req.body
  //console.log( "The id passed is : "+ id + id[0] + id.aid )
  Record.find({ aid : id.aid } ,(error,user)=>{
    if( error ){
      console.log("Error in All Article comment Fetch :  "+error )
    }
    else{
      console.log("Articles comment Fetched Successfully discussed")
      res.status(200).send( user )
    }
  }).sort( {"values.time": -1} )
})
/* End Fetch Discuss */
/* Discuss Insert */
/* Discuss insert function */
function insertComment( req , res ){

  let seq_val = 0;
  let val = req.body
  Increment.findOne( { aid : val.aid } ).then(result => {
    if( result ) {
      console.log(`Successfully found document: ${result}.`);
      var str = JSON.stringify(result);
      var myarray = str.split(':');
      var seq = myarray[2].split(',');
      console.log('Value is :  ' + seq[0]);
      if( seq[0] )
      {
        Increment.findOneAndUpdate({ aid : val.aid }, { sequence_value : parseInt(seq[0]) + 1 } )
          .then(updatedDocument => {
            if(updatedDocument) {
              console.log(`Successfully updated document: ${updatedDocument}.`)
              seq_val =  parseInt( seq[0] ) + 1
              console.log("Inside insert comment " +  seq_val + req + res )
              console.log( req.headers.authorization )
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
              let userId = payload.subject
              console.log( "Success till payload ")
              const Record1 = require('../models/data-object');
              Record1.findOne({ _id: userId },(error,user1)=>{
                if( error ){
                  console.log("Error in login :  "+error )
                }
                else{
                  if( !user1 )
                  {
                    res.status(401).send( "Invalid Email")
                  }
                  else{
                      console.log("User Validated :")
                      if (seq_val) {
                        const user = new Record({
                          aid : val.aid,
                          values : {
                            uid : user1.uid,
                            cid: seq_val,
                            name: user1.name,
                            email: user1.email,
                            comment : val.comment,
                            upvote : 0,
                            downvote : 0,
                            time : Date.now()
                          }
                        });
                        user.save((error, registeredUser) => {
                          if (error) {
                            console.log(error)
                            res.status(401).send(error.error)
                          } else {
                            Record.find({ aid : val.aid } ,(error,user)=>{
                              if( error ){
                                console.log("Error in All Article comment Fetch :  "+error )
                              }
                              else{
                                console.log("Articles comment Fetched Successfully")
                                res.status(200).send( user )
                              }
                            }).sort( {"values.time": -1} )
                          }
                        })
                      }

                  }
                }
              })
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
/* auto increment cid  and insert user comment ends*/
router.post("/discuss", (req, res, next) => {
  insertComment( req , res )
});
/* End Discuss Insert API */
/* user id fetch*/
function fetchUser( req , res , next ) {
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
  return req.userId
}

/* user id ends*/
/* Upvote Increment */
router.post( '/upvoteIncrement' ,  verifyToken , (req ,res )=> {
  let id = req.body
  console.log("Upvote Increment" + id.cid + id.aid)
  /*let user = fetchUser(req, res)
  if (user) {
      flags.find({ uid : user }).then(result=>{
        if (result) {
          console.log(`Successfully found document: ${result.values.cid}. ${result}`);
          if( user.downvote === true )
        } else {
          console.log("Empty " + result)
          const newFlag = new flags({
            uid : user ,
            cid : id.cid,
            aid : id.aid,
            upvote : true,
            downvote : false
          })
          newFlag.save()
        }
      })

   */
      Record.findOneAndUpdate({aid: id.aid, "values.cid": id.cid}, {$inc: {"values.upvote": 1}}).then(result => {
      if (result) {
        console.log(`Successfully found document: ${result.values.cid}. ${result}`);
        res.status(200).send([result])
      } else {
        console.log("Empty " + result)
      }
    })
})
/* Upvote Increment Ends*/

/* Upvote Decrement */
router.post( '/upvoteDecrement' ,  verifyToken , (req ,res )=> {
  let id = req.body
  console.log("upvoteDecrement" + id.cid + id.aid )
  Record.findOneAndUpdate({ aid : id.aid , "values.cid": id.cid } , { $inc : {"values.upvote": -1 } }).
  then(result => {
    if (result) {
      console.log(`Successfully found document: ${result.values.cid}.`);
      res.status(200).send( [result] )
    }else{
      console.log( "Empty "+ result )
    }
  })
})
/* Upvote Decrement Ends*/
/* Downvote Increment Ends*/
router.post( '/downvoteIncrement' ,  verifyToken , (req ,res )=> {
  let id = req.body
  console.log("downvoteDecrement" + id.cid + id.aid )
  Record.findOneAndUpdate({ aid : id.aid , "values.cid": id.cid } , { $inc : {"values.downvote": 1 } }).
  then(result => {
    if (result) {
      console.log(`Successfully found document: ${result.values.cid}.`);
      res.status(200).send( [result] )
    }else{
      console.log( "Empty "+ result )
    }
  })
})
/* Downvote Increment Ends*/

/* downvote Decremente */
router.post( '/downvoteDecrement' ,  verifyToken , (req ,res )=> {
  let id = req.body
  console.log("downvoteDecrement" + id.cid + id.aid )
  Record.findOneAndUpdate({ aid : id.aid , "values.cid": id.cid } , { $inc : {"values.downvote": -1 } }).
  then(result => {
    if (result) {
      console.log(`Successfully found document: ${result.values.cid}.`);
      res.status(200).send( [result] )
    }else{
      console.log( "Empty "+ result )
    }
  })
})
/* downvote Decrement  Ends*/

module.exports = router;

