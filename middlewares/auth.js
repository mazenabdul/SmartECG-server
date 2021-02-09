const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
//Import mongoDB user instance
const Users = mongoose.model('Users')

module.exports = async (req,res,next) => {
  //The JWT token is stored in the request header
  const { authorization } = req.headers

  if(!authorization) {
    return res.status(401).send('You must be signed in')
  } 

  //The token will have Bearer, replace it with empty space 
  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, 'SecretKey', async (err, payload) => {
    if(err){
      return res.status(401).send('Unauthorized')
    }

    //When the user was sent a JWT token, in the payload it has the MongoDB ID
    const { userId } = payload

    //Find the user based on the JWT token 
    const user = await Users.findById(userId)

    req.user = user
    next()

  })
}