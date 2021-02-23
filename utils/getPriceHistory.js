const CoinGecko = require("coingecko-api");
const sleep = require('ko-sleep');

const CoinGeckoClient = new CoinGecko();

const getPriceHistory = async () => {
  console.log("get history")

  const getCgData = async () => {
    let tries = 0
    const today = new Date() / 1000
    const oneYearAgo = today - 31540000000 / 1000
    let gotHistory = false
    while (!gotHistory) {
      try {
        let priceData = await CoinGeckoClient.coins.fetchMarketChartRange('finnexus', {
          from: oneYearAgo,
          to: today,
        })
        if (priceData.success) {
          gotHistory = true
          return priceData
        }
      }
      catch(err){
        tries += 1
        if (tries > 5) return {error: true}
        await sleep(100)
        console.log(err)
      }
    }
  }
  
  const priceData = await getCgData()
  if (priceData.error) return priceData
  const prices = priceData.data.prices.map((price, index) => {
    const date = new Date(price[0]).toDateString().slice(4,)
    const roundedPrice = Math.round(price[1] * 100)/100
    return {
      key: Math.random(),
      name: date,
      price: roundedPrice,
    }
  })
  const timestamp = Date.now()
  return {prices: prices, timestamp: timestamp}
}

module.exports = getPriceHistory