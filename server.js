require("dotenv").config()
const express = require('express')
const rateLimit = require("express-rate-limit");
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./utils/db')


const apiRoutes = require('./routes/api')
const isReady = require('./middleware/isReady')
const removeTrailingSlash = require('./middleware/removeTrailingSlash');
const { get } = require('./routes/api');


const PORT = process.env.PORT || 3001

// let ready = false
// getReady().then(result => ready = result)

const app = express()

// Limit request rate
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
app.use(cors())
app.use(bodyParser.text())


// limit requests
app.use(limiter);

// remove trailing slash
app.use(removeTrailingSlash);

// add cached data to req
app.get('*', async (req, res, next) => {
  const client = db.getClient()
  try {
    await db.getCachedData(client).then(result => req.chainData = result)
    await db.getCachedDataRanges(client).then(result => req.ranges = result)
  }
  catch(err){
    console.log(err)
  }
  next()
})

// Logging
app.use(morgan('tiny'))

// Remove trailing slash

// Routes
app.use(/^\/$/, (req, res) => {
  res.send("Welcome to the FinNexus FNX API! Full docs are at: <a target=_blank href=https://www.docs.finnexus.io/apis/token/>https://www.docs.finnexus.io/apis/token/</a> ")
})

app.use('/api/v1', isReady)

app.use('/api/v1', apiRoutes)

app.use((req, res) => {
  res.status(404).json({error: true, message: "Resource not found - see API updates and find available endpoints in docs at: <a target=_blank href=https://www.docs.finnexus.io/apis/token/>https://www.docs.finnexus.io/apis/token/</a>. As the v0.1 Alpha version of the API is still under development, routes may change. Contact @noahniuwa on Telegram with any questions."})
})

app.listen(PORT)

console.log(`App listening on ${PORT}`)