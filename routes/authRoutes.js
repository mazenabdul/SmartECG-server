//Acquire express router 
const express = require('express')
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

//Import mongoDB user instance
const Users = mongoose.model('Users')

//Intialize router 
const router = express.Router()

//Sign up route 
router.post('/signup', 

//body('email').isEmail(),
body('password').isLength({ min: 5, max: 25 }),

async (req, res) => {
  const { email, password } = req.body

  //Check validation result
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({ msg: 'Please enter valid email and password' })
  }
 try {

    //Create new user based on the schema
    const user = new Users({ email, password  })

    //Save the user to the database
    await user.save()
  
    //Send a JWT token - This will help identify the user in protected routes
    jwt.sign({userId: user._id}, 'SecretKey', {expiresIn: 360000}, (err, token) => {
      if(err){
        res.send(err)
      } 
        res.json({ token })
    })
         
 } catch (err) {
   res.status(422).send(err)
 }
  
})

//Sign in route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  try {

    //Search the database for the supplied user 
    const user = await Users.findOne({ email })

    if(!user){
      return res.status(500).json({ msg: 'User does not exist' })
    }

    //If it exists in the database, compare the DB email and pass with the supplied email and pass
    if(email !== user.email || password !== user.password){
      return res.status(401).json({ msg: 'Invalid E-mail and/or Password' })
    }

    //Send a JWT token 
    jwt.sign({userId: user._id}, 'SecretKey', {expiresIn: 360000}, (err, token) => {
      if(err){
        res.send(err)
      }
      res.json({ token, email })
    })
    
  } catch (err) {
    return res.json({ error: err })
  }
})

//Sign out route 
router.post('/signout', (req, res) => {
  res.send('Signed out')
  
})

module.exports = router 