const getReady = require('../utils/getReady')
let ready = false
getReady().then(result => ready = result)

const isReady = (req, res, next) => {
  if (!ready) {
    // return res.json({ready: false, message: 'Service is intializing...' })
    req.notReady = true
  } 
  next()
}

module.exports = isReady