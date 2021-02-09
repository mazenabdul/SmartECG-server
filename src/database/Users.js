//Define the model for users in the database
const mongoose = require('mongoose')

//Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },  
  password: {
    type: String,
    required: true
  },
    data: [Object]
  
})


//Create model 
mongoose.model('Users', userSchema)

