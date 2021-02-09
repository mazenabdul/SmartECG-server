const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()
const mongoose = require('mongoose')
const Users = mongoose.model('Users')


//Route for requesting daily data - PROTECTED ROUTE. 
router.post('/daily', auth, async (req, res) => {
  
  //Find the user in the DB, extract its data object 
  const user = await Users.findById(req.user._id)
  console.log(req.body.dateString)
  //console.log(user.data)
  const values = user.data
  values.filter((obj) => {
    try {
      if(obj.timestamp.includes(req.body.dateString)) {
        const voltages = obj.voltage
        const time = obj.time
        console.log(voltages, time)
        //return (voltages, time)
       } 
    } catch (e) {
      console.error(e)
    }
  })

})

  //Filter out the voltage and time arrays for the current date 
  //const voltages = await user.find({  })
  //console.log(user[0].data)
  //return res.send(user.data)



router.get('/weekly', auth, async (req, res) => {
  const user = await Users.findById(req.user._id)

  //Return the voltage and time arrays for weekly  time frame
  const voltage = user.voltage
  const time = user.time

  //Filter out the voltage and time arrays for the last 7 days according to the date

  //Return appropriate arrays
  return res.send({ voltage, time })
})

router.get('/monthly', auth, async (req, res) => {
  const user = await Users.findById(req.user._id)

  //Return the voltage and time arrays for this time frame
  const voltage = user.voltage
  const time = user.time

  //Filter out the voltage and time arrays for the last 28 days according to the date

  return res.send({ voltage, time })
})


module.exports = router