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
  
  try{
    const filtered = data.filter(obj => {
      return obj.timestamp === dateString 
    })
    
      
      if(filtered.length === 0){
        res.status(404).send({ error: 'No matching results' })
      } else {
        res.send(filtered)
      }
  } catch (e){
    console.error(e)
}
  

  
})

router.post('/weekly', auth, async (req, res) => {
  const user = await Users.findById(req.user._id)
  const { dates } = req.body
  const { data } = user //All user data 
  
  const starting = dates.startDate.slice(0,10)
  const ending = dates.endDate.slice(0,10)
  //console.log(starting, ending)

  //Returns an array of dates between the two dates
  const getDates = (startDate, endDate) => {
    let dates = [],
        currentDate = startDate,
        addDays = function(days) {
          let date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };

  let dateArray = []
  const dateList = getDates(new Date(starting), new Date(ending));                                                                                                           
  dateList.forEach(function(date) {
    const dateStrings = JSON.stringify(date).slice(1,11)
    dateArray.push(dateStrings)
  });
    //console.log(dateArray[0], dateArray[1])

    //Now that we have an array of dates, we need to store the comparisons of results in a results array
    const results = []

    //Loop over the dates array and filter out the matching dates from the user data retrieved earlier
    for(date of dateArray){
      const filtered = data.filter(obj => {
        return obj.timestamp === date //This filters all matching results
      })
        for(entry of filtered){
          results.push(entry) //Push all existing values, remove empty ones into global array 
        }
        
    }

    res.send(results)

    if(results.length===0){
      res.status(404).send({ error: 'No data found for selected range' })
    }
    
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

  //console.log(filtered)
  

  return res.send(filtered)
  
})

module.exports = router