const schedule = require("node-schedule")
const CoinGecko = require("coingecko-api")
const fnxAbi = require("../abi/fnxAbi.json")
const fpoProxyAbi = require("../abi/fpoProxyAbi.json")
const getDataRanges = require("./getDataRanges")
const collateralPoolAbi = require("../abi/collateralPoolAbi.json")
const fnxEthAbi = require("../abi/fnxEthAbi.json")
const numeral = require("numeral")
const Web3 = require("web3")
const db = require("./db")

 
const setupWeb3 = async () => {
  const eth_web3 = await new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_URL))
  const wan_web3 = await new Web3(new Web3.providers.HttpProvider(process.env.WAN_ENDPOINT))
  return {eth_web3, wan_web3}
}

//Define all ETH addresses

const tokenAddrs = {
  eth_fnx: "0xef9cd7882c067686691b6ff49e650b43afbbcc6b",
  eth_usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  wan_fnx: "0xC6F4465A6a521124C8e3096B62575c157999D361",
  wan_wan: "0x0000000000000000000000000000000000000000",
  wan_usdt: "0x11e77e27af5539872efed10abaa0b408cfd9fbbd",
  eth_usdt: "0xdac17f958d2ee523a2206206994597c13d831ec7"
}
const colProxyAddrs = {
  eth_fnx: "0x919a35a4f40c479b3319e3c3a2484893c06fd7de",
  eth_usdc: "0xff60d81287bf425f7b2838a61274e926440ddaa6",
  wan_wan_fnx: "0xe96e4d6075d1c7848ba67a6850591a095adb83eb",
  wan_usdt: "0xa6a12974196ab9de7aa3f998e0d690f1a80a4c11",
  col_pool_wan_usdt: "0x297ff55afef50c9820d50ea757b5beba784757ad",
  // wan_options_manager: "0xa6a12974196ab9de7aa3f998e0d690f1a80a4c11"
}

//Define all WAN addresses
const fnxTokenSc = "0xc6f4465a6a521124c8e3096b62575c157999d361"
const domainsaleSc = "0xbea86febb799cbf3518a478344588a73e0ddf8db"
const opReservesAddress = "0x70197ee9981c3415404b47541155873d69d5c510"
const teamAndFoundersAddress = "0x490fbf44fbcdb0c19209ae013ac9174738e670c5"
const communityRewardsAddress = "0xd5b5965754102660d9cce5bc57a7dc2a87e359d9"
const um1sConversionAddress = "0xcdf1a03225367263a549d04ed2fd3384ab127895"
const institutionalAdress = "0x81a71185f4edb512051677426f1c95680356177b"
const burnedAddress = "0x0000000000000000000000000000000000000000"
const um1sSc = "0xcdf1a03225367263a549d04ed2fd3384ab127895"
const uniSwapSc = "0x722885cab8be10b27f359fcb225808fe2af07b16"
const fnxErc20Sc = "0x749a2594508a0e8090857393b87a1048c83ac758"
const eth_cfnx_add = "0x955282b82440f8f69e901380bef2b603fba96f3b"
const wan_cfnx_add = "0x1db7b24da0ce4e678e4389fd2e4d4008c1dfed71"

// Set number formatting default
numeral.defaultFormat("0,0.00");

// For converting to proper number of decimals
const convertNum = (num, decimal) => {
  return Math.round((num / (10*10**(decimal-3))))/100
}

// Set up chain data object
const chainData = {}


const getData = async (web3s) => {
  const {eth_web3, wan_web3} = web3s
  const currentBlockNumber = await wan_web3.eth.getBlockNumber()
  const currentEthBlockNumber = await eth_web3.eth.getBlockNumber()

  //Instantiate all token smart contract objects
  let fnx = new wan_web3.eth.Contract(fnxAbi, fnxTokenSc)
  let fnxEth = new eth_web3.eth.Contract(fnxEthAbi, tokenAddrs.eth_fnx)
  let um1s = new wan_web3.eth.Contract(fnxAbi, um1sSc)
  let eth_fnx_colProxy = new eth_web3.eth.Contract(fpoProxyAbi, colProxyAddrs.eth_fnx)
  let eth_usdc_colProxy = new eth_web3.eth.Contract(fpoProxyAbi, colProxyAddrs.eth_usdc)
  let wan_colProxy = new wan_web3.eth.Contract(fpoProxyAbi, colProxyAddrs.wan_wan_fnx)
  let col_pool_wan_usdt = new wan_web3.eth.Contract(collateralPoolAbi, colProxyAddrs.col_pool_wan_usdt)


  // Get all base values  
  let ethCurrentTotalSupply = await fnxEth.methods.totalSupply().call()
  ethCurrentTotalSupply = Number(ethCurrentTotalSupply)
  let eth_fnxPoolTotal = await eth_fnx_colProxy.methods.getNetWorthBalance(tokenAddrs.eth_fnx).call()
  let eth_usdcPoolTotal = await eth_usdc_colProxy.methods.getNetWorthBalance(tokenAddrs.eth_usdc).call()
  let eth_usdtPoolTotal = await eth_usdc_colProxy.methods.getNetWorthBalance(tokenAddrs.eth_usdt).call()
  let wan_fnxPoolTotal = await wan_colProxy.methods.getNetWorthBalance(tokenAddrs.wan_fnx).call()
  let wan_wanPoolTotal = await wan_colProxy.methods.getNetWorthBalance(tokenAddrs.wan_wan).call()
  let wan_usdtPoolTotal = await col_pool_wan_usdt.methods.getNetWorthBalance(tokenAddrs.wan_usdt).call()
  let eth_cfnx = await fnx.methods.balanceOf(eth_cfnx_add).call()  	
  let wan_cfnx = await fnx.methods.balanceOf(wan_cfnx_add).call()  	


  let maxAmount = await fnx.methods.MAX_TOTAL_TOKEN_AMOUNT().call()  
  let minted = await fnx.methods.totalMinted().call()  
  let opReserves = await fnx.methods.balanceOf(opReservesAddress).call()  
  let teamAndFounders = await fnx.methods.balanceOf(teamAndFoundersAddress).call()  	
  let communityRewards = await fnx.methods.balanceOf(communityRewardsAddress).call() 
  let institutional = await fnx.methods.balanceOf(institutionalAdress).call()  
  let burned = await fnx.methods.balanceOf(burnedAddress).call()  
  let um1sTotal = await um1s.methods.totalSupply().call()  
 
  // Get all derived values
  let converted = um1sTotal * 10 // 9. Converted FNX
  burned = Number(burned) + Number(converted)	 + Number(322324e18)
  let currentTotalSupply = minted - burned // 3. Current Total Supply
  let wanCurrentTotalSupply = currentTotalSupply - ethCurrentTotalSupply
  let fnxCirculatingSupply = currentTotalSupply - opReserves - teamAndFounders - communityRewards - institutional // 10. FNX in Circulation	
  let effectiveCirculatingSupply = fnxCirculatingSupply - eth_cfnx - wan_cfnx - eth_fnxPoolTotal - wan_fnxPoolTotal // 12. FNX in Circulation (deducting the locked in FPO)	
  let fnxCirculatingSupplyWan =  convertNum(fnxCirculatingSupply - ethCurrentTotalSupply, 18)
  let fnxCirculatingSupplyEth =  convertNum(ethCurrentTotalSupply, 18)
  let wan_wanPoolTotalValue = Number(wan_wanPoolTotal)
  let wan_usdtPoolTotalValue = Number(wan_usdtPoolTotal)
  let eth_fnxPoolTotalValue = Number(eth_fnxPoolTotal)
  let eth_usdcPoolTotalValue = Number(eth_usdcPoolTotal)
  let eth_usdtPoolTotalValue = Number(eth_usdtPoolTotal)
  let wan_fnxPoolTotalValue = Number(wan_fnxPoolTotal)
  let fpoTvl = 0
  let fpoTvlEth = 0
  let fpoTvlWan = 0

  let rawNumbers = {
    fpoTvl,
    fpoTvlEth,
    fpoTvlWan,
    wan_wanPoolTotalValue,
    wan_usdtPoolTotalValue,
    eth_usdtPoolTotalValue,
    eth_fnxPoolTotalValue,
    eth_usdcPoolTotalValue,
    wan_fnxPoolTotalValue,
    wan_wanPoolTotal,
    eth_fnxPoolTotal,
    eth_usdcPoolTotal,
    wan_fnxPoolTotal,
    ethCurrentTotalSupply,
    wanCurrentTotalSupply,
    maxAmount, 
    minted, 
    currentTotalSupply, 
    opReserves, 
    teamAndFounders, 
    communityRewards, 
    institutional,
    burned,
    fnxCirculatingSupply,
    effectiveCirculatingSupply,
  }

  let itemInfo = {
    fpoTvl: {dapp: "FPO", chain: "WAN", units: "USD", name: "TVL", description: "Total value of assets locked in FPO"}, 
    fpoTvlEth: {dapp: "FPO", chain: "ETH", units: "USD", name: "TVL @ETH", description: "Total value of assets locked in FPO on Ethereum"}, 
    fpoTvlWan: {dapp: "FPO", chain: "WAN", units: "USD", name: "TVL @WAN", description: "Total value of assets locked in FPO on Wanchain"}, 
    wan_wanPoolTotalValue: {dapp: "FPO", chain: "WAN", units: "USD", name: "WAN TVL @WAN", description: "Total value of WAN in FPO pool on Wanchain"}, 
    wan_usdtPoolTotalValue: {dapp: "FPO", chain: "WAN", units: "USD", name: "USDT TVL @WAN", description: "Total value of USDT in FPO pool on Wanchain"}, 
    eth_fnxPoolTotalValue: {dapp: "FPO", units: "USD", name: "FNX TVL @ETH", description: "Total value of FNX in FNX FPO pool on Ethereum"}, 
    eth_usdcPoolTotalValue: {dapp: "FPO", chain: "ETH", units: "USD", name: "USDC TVL @ETH", description: "Total value of USDC in USDC/USDT FPO pool on Ethereum"}, 
    eth_usdtPoolTotalValue: {dapp: "FPO", chain: "ETH", units: "USD", name: "USDT TVL @ETH", description: "Total value of USDT in USDC/USDT FPO pool on Ethereum"}, 
    wan_fnxPoolTotalValue:  {dapp: "FPO", chain: "WAN", units: "USD", name: "FNX TVL @WAN", description: "Total value of FNX in FPO pool on Wanchain"}, 
    wan_wanPoolTotal: {dapp: "FPO", chain: "WAN", units: "WAN", name: "WAN Pool @WAN", description: "Total amount of WAN in FPO pool on Wanchain"}, 
    eth_fnxPoolTotal: {dapp: "FPO", chain: "ETH", name: "FNX Pool @ETH", description: "Total amount of FNX in FNX FPO pool on Ethereum"}, 
    eth_usdcPoolTotal: {dapp: "FPO", chain: "ETH", units: "USDC", name: "USDC Pool @ETH", description: "Total amount of USDC in USDC FPO pool on Ethereum"}, 
    wan_fnxPoolTotal:  {dapp: "FPO", chain: "WAN", name: "FNX Pool @WAN", description: "Total amount of FNX in FPO pool on Wanchain"}, 
    ethCurrentTotalSupply: {dapp: "N/A", chain: "ETH", name: "Total Supply @ETH", description: "Current total supply of FNX on Ethereum"}, 
    wanCurrentTotalSupply: {dapp: "N/A", chain: "WAN", name: "Total Supply @WAN", description: "Current total supply of FNX on Wanchain"}, 
    maxAmount: {dapp: "N/A", chain: "ALL", name: "Max Supply", description: "Max potential supply of FNX"}, 
    minted: {dapp: "N/A", chain: "ALL", name: "Minted", description: "Total number of minted FNX"},  
    currentTotalSupply: {dapp: "N/A", chain: "ALL", name: "Total Supply", description: "Current total supply of FNX (minted FNX minus burnt FNX)"}, 
    opReserves: {dapp: "N/A", chain: "ALL", name: "Operations Reserve", description: "FNX reserved for operational costs"}, 
    teamAndFounders: {dapp: "N/A", chain: "ALL", name: "Team Reserve", description: "FNX reserved for team and founding investors"},
    communityRewards: {dapp: "N/A", chain: "ALL", name: "Community Rewards", description: "Community rewards fund (for liquidity mining and DAO)"},
    institutional: {dapp: "N/A", chain: "ALL", name: "Institutional Reserve", description: "FNX reserved for institutional investors"},
    burned: {dapp: "N/A", chain: "ALL", name: "Burnt", description: "Total amount of burnt FNX"},
    fnxCirculatingSupply: {dapp: "N/A", chain: "ALL", name: "Circulating", description: "Total amount of FNX in circulation (minted FNX minus reserved & burnt FNX)"},
    effectiveCirculatingSupply: {dapp: "N/A", chain: "ALL", name: "Effective Circulating", description: "Effective circulating supply of FNX (circulating FNX minus locked FNX)"},
  }

  // Set cases for different decimals 
  Object.keys(rawNumbers).forEach(key => {
    const name = itemInfo[key].name
    const chain = itemInfo[key].chain
    let decimals 
    switch (itemInfo[key].units) {
      case "FNX":
        decimals = 18
        break
      case "USDC":
        decimals = 6
        break
      case "WAN":
        decimals = 18
        break
      default:
        decimals = 18
    }
    if (key === "eth_usdcPoolTotalValue") decimals = 6
    if (key === "eth_usdtPoolTotalValue") decimals = 6
    if (key === "wan_usdtPoolTotalValue") decimals = 6

    const units = itemInfo[key].units ? itemInfo[key].units : "FNX"
    const description = itemInfo[key].description
    const dapp = itemInfo[key].dapp
    const num = convertNum(rawNumbers[key], decimals)
    const formattedNum = numeral(num).format()
    chainData[key] = { 
      name: name, 
      dapp: dapp,
      description: description, 
      units: units, 
      value: num, 
      formattedValue: formattedNum, 
      blockWan: currentBlockNumber, 
      blockEth: currentEthBlockNumber, 
      timeStamp: Date()}
  
  })
  chainData.blockWan = currentBlockNumber
  chainData.blockEth = currentEthBlockNumber


  // Raw & Decimals
  chainData.ethCurrentTotalSupplyRaw = rawNumbers.ethCurrentTotalSupply
  chainData.wanCurrentTotalSupplyRaw = rawNumbers.wanCurrentTotalSupply
  chainData.ethCurrentTotalSupplyRawDecimals = convertNum(rawNumbers.ethCurrentTotalSupply, 18)
  chainData.wanCurrentTotalSupplyRawDecimals = convertNum(rawNumbers.wanCurrentTotalSupply, 18)
  chainData.currentTotalSupplyRaw = rawNumbers.currentTotalSupply
  chainData.fnxCirculatingSupplyWan = fnxCirculatingSupplyWan
  chainData.fnxCirculatingSupplyEth = fnxCirculatingSupplyEth
  chainData.fnxCirculatingSupplyRaw = rawNumbers.fnxCirculatingSupply
  chainData.fnxCirculatingSupplyRawDecimals = convertNum(fnxCirculatingSupply, 18)
  chainData.currentTotalSupplyRawDecimals = convertNum(currentTotalSupply, 18)
  chainData.timeStamp = Date.now()

  // Add prices

  // Get price data

const CoinGeckoClient = new CoinGecko();


const getPriceData = async () => {
  let priceData = await CoinGeckoClient.simple.price({
    ids: ["usd-coin", "wanchain", "finnexus", "tether"],
    vs_currencies: ["usd"],
  });
  chainData.fnxPrice = priceData.data["finnexus"].usd
  chainData.wan_wanPoolTotalValue.value = chainData.wan_wanPoolTotalValue.value * priceData.data["wanchain"].usd
  chainData.eth_fnxPoolTotalValue.value = chainData.eth_fnxPoolTotalValue.value * priceData.data["finnexus"].usd
  chainData.eth_usdcPoolTotalValue.value = chainData.eth_usdcPoolTotalValue.value * priceData.data["usd-coin"].usd
  chainData.eth_usdtPoolTotalValue.value = chainData.eth_usdtPoolTotalValue.value * priceData.data["tether"].usd
  chainData.wan_usdtPoolTotalValue.value = chainData.wan_usdtPoolTotalValue.value * priceData.data["tether"].usd
  chainData.wan_fnxPoolTotalValue.value = chainData.wan_fnxPoolTotalValue.value * priceData.data["finnexus"].usd
  
  chainData.wan_wanPoolTotalValue.formattedValue = numeral(chainData.wan_wanPoolTotalValue.value).format() 
  chainData.eth_fnxPoolTotalValue.formattedValue = numeral(chainData.eth_fnxPoolTotalValue.value).format() 
  chainData.eth_usdcPoolTotalValue.formattedValue = numeral(chainData.eth_usdcPoolTotalValue.value).format() 
  chainData.eth_usdtPoolTotalValue.formattedValue = numeral(chainData.eth_usdtPoolTotalValue.value).format() 
  chainData.wan_usdtPoolTotalValue.formattedValue = numeral(chainData.wan_usdtPoolTotalValue.value).format() 
  chainData.wan_fnxPoolTotalValue.formattedValue = numeral(chainData.wan_fnxPoolTotalValue.value).format()

  chainData.fpoTvl.value = chainData.wan_wanPoolTotalValue.value + chainData.eth_fnxPoolTotalValue.value + chainData.eth_usdtPoolTotalValue.value + chainData.eth_usdcPoolTotalValue.value + chainData.wan_usdtPoolTotalValue.value + chainData.wan_fnxPoolTotalValue.value
  chainData.fpoTvl.formattedValue = numeral(chainData.fpoTvl.value).format()

  chainData.fpoTvlEth.value = chainData.eth_fnxPoolTotalValue.value + chainData.eth_usdcPoolTotalValue.value + chainData.eth_usdtPoolTotalValue.value 
  chainData.fpoTvlEth.formattedValue = numeral(chainData.fpoTvlEth.value).format()

  chainData.fpoTvlWan.value = chainData.wan_wanPoolTotalValue.value + chainData.wan_fnxPoolTotalValue.value + chainData.wan_usdtPoolTotalValue.value
  chainData.fpoTvlWan.formattedValue = numeral(chainData.fpoTvlWan.value).format()
}

  await getPriceData()

  try {
    console.log("About to update chaindata")
    const client = db.getClient()
    db.updateChainData(chainData, client) 
  }
    catch(err) {
    console.log(err)
  }

}


const scheduleUpdates = async (web3s) => {
 const getDataSchedule = schedule.scheduleJob("*/5 * * * *", async () => {   
   console.log("About to run getData to get token data using Infura") 
    getData(web3s)
  })
  
 const getRangeSchedule = schedule.scheduleJob("*/5 * * * *", async () => { 
    console.log("About to run getDataRanges to get token price data from CoinGecko")
    getDataRanges()
  })
}


const getAllData = async () => {
  
  const web3s = await setupWeb3()
  await scheduleUpdates(web3s)

} 

getAllData()

module.exports = chainData
