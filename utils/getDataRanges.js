const getPriceHistory = require("./getPriceHistory")
const fetch = require("node-fetch")
const db = require("./db")

const getDataRanges = async () => {

  const dataRanges = await getPriceHistory()
  console.log("got price range")
  if (dataRanges.error) {
    const error = {error: true, message: "Failed to get price history data"}
    console.log(error)
    return error
  }

  try {
    const client = db.getClient()
    db.updateDataRanges(dataRanges, client) 
    console.log("db updated")
    fetch("https://api.vercel.com/v1/integrations/deploy/QmNfpQhmvLVodyqcWsiDoBZorS3WmihLsZ6ergrRazJzy3/ZSfwMU0IQr")
  }
    catch(err) {
    console.log(err)
  }
}

module.exports = getDataRanges