const express = require("express");
const Record = require('../models/data-object');
const Profile = require('../models/profile-object')
const Increment = require('../models/auto');
const jwt = require("jsonwebtoken");

const router = express.Router();

/* Updating registered user information in profile collection Starts*/
function updateUserInfoInProfile(seq_val,req){
  const user = new Profile({
    uid: seq_val,
    name: req.body.name,
    email: req.body.email
  });

  user.save().catch(error => {
    console.log("Something went wrong during profile update :",error)
  });
}
/* Updating registered user information in profile collection Ends*/

/* auto increment uid and insert user */
function insertUser( req , res ){
  let seq_val = 0;
  Increment.findOne({name:"pranesh"}).then(result => {
    if( result ) {
      console.log(`Successfully found document: ${result}.`);
      /*const num = parseInt(result.sequence_value);
      console.log("the number is " + num)*/
      const str = JSON.stringify(result);
      const array = str.split(':');
      const seq = array[2].split(',');
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
                  const user = new Record({
                    uid: seq_val,
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                  });

                  user.save((error, registeredUser) => {
                    if (error) {
                      console.log(error)
                      Increment.findOneAndUpdate({ name : "pranesh" }, { sequence_value : parseInt(seq_val) - 1 } )
                        .then(() => {
                          console.log("Sequence Value decremented since the user is already exists.")
                        })
                      res.status(401).send(error.error)
                    } else {
                      let payload = {subject: registeredUser._id}
                      let token = jwt.sign(payload, 'secretKey')
                      updateUserInfoInProfile(seq_val,req);
                      res.status(200).send({token})
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
/* auto increment uid  and insert user ends*/
/* Token Verifier */
function verifyToken( req , res , next ) {
  if( !req.headers.authorization ){
    return res.status(401).send( "Unauthorized request ")
  }
  let token = req.headers.authorization.split(' ')[1]
  if( token === 'null' )
  {
    return res.status(401).send( "Unauthorized req ")
  }
  let payload = jwt.verify( token,'secretKey')
  if( !payload ){
    return res.status(401).send( "Unauthorized user ")
  }
  req.userId = payload.subject
  next()
}
/* END Token Verifier */
/* start signup */
router.post("/signup", (req, res) => {
      insertUser( req , res )
});

/* sign Up */

/* Login API */
router.post( '/login' , (req,res)=>{
  let userData = req.body
  Record.findOne({email:userData.email},(error,user)=>{
    if( error ){
      console.log("Error in login :  "+error )
    }
    else{
      if( !user )
      {
        res.status(401).send( "Invalid Email")
      }
      else{
        if( user.password !== userData.password ){
          res.status(401).send( "Invalid Password")
        }
        else{
          console.log("In Login :")
          let payload = { subject : user._id }
          let token = jwt.sign( payload, 'secretKey')
          res.status(200).send({token} )
        }
      }
    }
  })
})
/* End Login API */
/* Api for news */
router.get( '/news' , verifyToken, (req ,res )=> {
  // events has Name City Country
  let specials = [
    {
      "Name": "Alfreds Futterkiste",
      "City": "Berlin",
      "Country": "Germany"
    },
    {
      "Name": "Ana Trujillo Emparedados y helados",
      "City": "México D.F.",
      "Country": "Mexico"
    },
    {
      "Name": "Antonio Moreno Taquería",
      "City": "México D.F.",
      "Country": "Mexico"
    },
    {
      "Name": "Around the Horn",
      "City": "London",
      "Country": "UK"
    },
    {
      "Name": "B's Beverages",
      "City": "London",
      "Country": "UK"
    },
    {
      "Name": "Berglunds snabbköp",
      "City": "Luleå",
      "Country": "Sweden"
    },
    {
      "Name": "Blauer See Delikatessen",
      "City": "Mannheim",
      "Country": "Germany"
    },
    {
      "Name": "Blondel père et fils",
      "City": "Strasbourg",
      "Country": "France"
    },
    {
      "Name": "Bólido Comidas preparadas",
      "City": "Madrid",
      "Country": "Spain"
    },
    {
      "Name": "Bon app'",
      "City": "Marseille",
      "Country": "France"
    },
    {
      "Name": "Bottom-Dollar Marketse",
      "City": "Tsawassen",
      "Country": "Canada"
    },
    {
      "Name": "Cactus Comidas para llevar",
      "City": "Buenos Aires",
      "Country": "Argentina"
    },
    {
      "Name": "Centro comercial Moctezuma",
      "City": "México D.F.",
      "Country": "Mexico"
    },
    {
      "Name": "Chop-suey Chinese",
      "City": "Bern",
      "Country": "Switzerland"
    },
    {
      "Name": "Comércio Mineiro",
      "City": "São Paulo",
      "Country": "Brazil"
    }
  ]
  res.json( specials )
})
/* Api news ends */
module.exports = router;
