//Create a sub schema 
const mongoose = require('mongoose')

const readings = mongoose.Schema({
  voltage: [Number],
  time: [Number]
})

const dataSchema = mongoose.Schema({
  
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users'
  },
  ecg: [readings]

})

mongoose.model('Data', dataSchema)