const schedule = require("node-schedule")
const CoinGecko = require("coingecko-api")
const fnxAbi = require("../abi/fnxAbi.json")
const fpoProxyAbi = require("../abi/fpoProxyAbi.json")
const getDataRanges = require("./getDataRanges")
const getTvl = require("./getTvl.js")
const collateralPoolAbi = require("../abi/collateralPoolAbi.json")
const fnxEthAbi = require("../abi/fnxEthAbi.json")
const numeral = require("numeral")
const Web3 = require("web3")
const db = require("./db")


// Set number formatting default
numeral.defaultFormat("0,0.00");

// For converting to proper number of decimals
const convertNum = (num, decimal) => {
  return Math.round((num / (10*10**(decimal-3))))/100
}



// Set up chain data object
let chainData = {}

const getData = async () => {
    chainData = await getTvl();

  try {
    console.log("About to update chaindata")
    const client = db.getClient()
    db.updateChainData(chainData, client) 
  }
    catch(err) {
    console.log(err)
  }

}


const scheduleUpdates = async () => {
 const getDataSchedule = schedule.scheduleJob("*/5 * * * *", async () => {   
   console.log("About to run getData to get token data using Infura") 
    getData()
  })
  
 const getRangeSchedule = schedule.scheduleJob("*/5 * * * *", async () => { 
    console.log("About to run getDataRanges to get token price data from CoinGecko")
    getDataRanges()
  })
}


const getAllData = async () => {
  
//  const web3s = await setupWeb3()
  await scheduleUpdates()

} 

getAllData()

module.exports = chainData
