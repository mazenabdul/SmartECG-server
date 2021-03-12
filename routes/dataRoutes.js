const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()
const mongoose = require('mongoose')
const Users = mongoose.model('Users')


//Route for requesting daily data - PROTECTED ROUTE. 
router.post('/daily', auth, async (req, res) => {
  
  //Find the user in the DB, extract its data object and selected date 
  const user = await Users.findById(req.user._id)
  const { dateString } = req.body
  const { data } = user

  const filtered = data.filter(obj => {
    return obj.timestamp === dateString 
  })
    res.send(filtered)

  if(filtered.length === 0){
    res.status(400).send({ error: 'No matching results' })
  } 
})

router.get('/weekly', auth, async (req, res) => {
  const user = await Users.findById(req.user._id)

  //Return the voltage and time arrays for weekly  time frame
  const voltage = user.voltage
  const time = user.time

  //Filter out the voltage and time arrays for the last 7 days according to the date

  //Return appropriate arrays
  return res.send({ voltage, time })
})

router.post('/monthly', auth, async (req, res) => {
  //Recieve the formatted string from the monthly endpoint along with the logged in user
  const user = await Users.findById(req.user._id)
  const { input } = req.body
  const { data } = user

  //Search through the user data and filter out matching dates
  const filtered = data.filter(matches => {
    return matches.timestamp.includes(input)
  })

  

  return res.send(filtered)
  
})

router.post ('/user', async (req,res) => {
  const user = await Users.findById(req.user._id)
  console.log(user)
})


module.exports = router