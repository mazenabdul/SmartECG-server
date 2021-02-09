//Load user schema
require('../src/database/Users')
//Acquire express, body-parser, mongoose libraries 
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRoutes = require('../routes/authRoutes')
const dataRoutes = require('../routes/dataRoutes')
const auth = require('../middlewares/auth')

//Initialize express server
const app = express()

//Middlewares
app.use(bodyParser.json())
app.use(authRoutes)
app.use(dataRoutes)

//Database connection - Link MongoDB database using mongoose 
const uri = 'mongodb+srv://ecg:ecg@cluster0.9vq9f.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.connect(uri, {
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  useNewUrlParser: true
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully')
})

mongoose.connection.off('error', () => {
  console.log('MongoDB connection failed')
})

//Root route of app
app.get('/', auth, (req,res) => {
  res.send(`Current user: ${req.user.email}`)
})

//Listen on port 3000
app.listen(3000, () => {
  console.log('Listening on port 3000')
})