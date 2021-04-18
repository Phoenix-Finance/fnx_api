const express = require('express')
const app = express.Router()
let itemInfo = {
  fpoTvl: {dapp: "FPO", chain: "ALL", units: "USD", name: "TVL", description: "Total value of assets locked in FPO"}, 
  fpoTvlEth: {dapp: "FPO", chain: "ETH", units: "USD", name: "Ethereum TVL", description: "Total value of assets locked in FPO on Ethereum"}, 
  fpoTvlBsc: {dapp: "FPO", chain: "BSC", units: "USD", name: "BSC TVL", description: "Total value of assets locked in FPO on BSC"}, 
  fpoTvlWan: {dapp: "FPO", chain: "WAN", units: "USD", name: "Wanchain TVL", description: "Total value of assets locked in FPO on Wanchain"}, 
  wan_wanPoolTotalValue: {dapp: "FPO", chain: "WAN", units: "USD", name: "WAN TVL @WAN", description: "Total value of WAN in WAN/FNX FPO pool on Wanchain"}, 
  wan_fnxPoolTotalValue:  {dapp: "FPO", chain: "WAN", units: "USD", name: "FNX TVL @WAN", description: "Total value of FNX in WAN/FNX FPO pool on Wanchain"}, 
  wan_usdtPoolTotalValue: {dapp: "FPO", chain: "WAN", units: "USD", name: "USDT TVL @WAN", description: "Total value of USDT in USDT FPO pool on Wanchain"}, 
  eth_fnxPoolTotalValue: {dapp: "FPO", chain: "ETH", units: "USD", name: "FNX TVL @ETH", description: "Total value of FNX in FNX FPO pool on Ethereum"}, 
  eth_usdcPoolTotalValue: {dapp: "FPO", chain: "ETH", units: "USD", name: "USDC TVL @ETH", description: "Total value of USDC in USDC/USDT FPO pool on Ethereum"}, 
  eth_usdtPoolTotalValue: {dapp: "FPO", chain: "ETH", units: "USD", name: "USDT TVL @ETH", description: "Total value of USDT in USDC/USDT FPO pool on Ethereum"}, 
  eth_fraxPoolTotalValue: {dapp: "FPO", chain: "ETH", units: "USD", name: "FRAX TVL @ETH", description: "Total value of FRAX in FRAX FPO pool on Ethereum"}, 
  bsc_fnxPoolTotalValue: {dapp: "FPO", chain: "BSC", units: "USD", name: "FNX TVL @BSC", description: "Total value of FNX in FNX FPO pool on BSC"}, 
  bsc_busdtPoolTotalValue: {dapp: "FPO", chain: "BSC", units: "USD", name: "BUSDT TVL @BSC", description: "Total value of BUSDT in BUSDT/BUSD FPO pool on BSC"}, 
  bsc_busdPoolTotalValue: {dapp: "FPO", chain: "BSC", units: "USD", name: "BUSD TVL @BSC", description: "Total value of BUSD in BUSDT/BUSD FPO pool on BSC"}, 
  wan_wanPoolTotal: {dapp: "FPO", chain: "WAN", units: "WAN", name: "WAN Pool @WAN", description: "Total amount of WAN in WAN/FNX FPO pool on Wanchain"}, 
  wan_fnxPoolTotal:  {dapp: "FPO", chain: "WAN", units: "FNX",name: "FNX Pool @WAN", description: "Total amount of FNX in WAN/FNX FPO pool on Wanchain"}, 
  wan_usdtPoolTotal:  {dapp: "FPO", chain: "WAN", units: "USDT",name: "USDT Pool @WAN", description: "Total amount of USDT in USDT FPO pool on Wanchain"}, 
  eth_fnxPoolTotal: {dapp: "FPO", chain: "ETH", units: "FNX", name: "FNX Pool @ETH", description: "Total amount of FNX in FNX FPO pool on Ethereum"}, 
  eth_usdcPoolTotal: {dapp: "FPO", chain: "ETH", units: "USDC", name: "USDC Pool @ETH", description: "Total amount of USDC in USDC/USDT FPO pool on Ethereum"}, 
  eth_usdtPoolTotal: {dapp: "FPO", chain: "ETH", units: "USDT", name: "USDT Pool @ETH", description: "Total amount of USDT in USDC/USDT FPO pool on Ethereum"}, 
  eth_fraxPoolTotal: {dapp: "FPO", chain: "ETH", units: "FRAX", name: "FRAX Pool @ETH", description: "Total amount of FRAX in FRAX FPO pool on Ethereum"}, 
  bsc_fnxPoolTotal: {dapp: "FPO", chain: "BSC", units: "FNX", name: "FNX TVL @BSC", description: "Total amount of FNX in FNX FPO pool on BSC"}, 
  bsc_busdtPoolTotal: {dapp: "FPO", chain: "BSC", units: "BUSDT", name: "BUSDT TVL @BSC", description: "Total amount of BUSDT in BUSDT/BUSD FPO pool on BSC"}, 
  bsc_busdPoolTotal: {dapp: "FPO", chain: "BSC", units: "BUSD", name: "BUSD TVL @BSC", description: "Total amount of BUSD in BUSDT/BUSD FPO pool on BSC"}, 
  
  ethCurrentTotalSupply: {units: "FNX", chain: "ETH", name: "Total Supply @ETH", description: "Current total supply of FNX on Ethereum"}, 
  bscCurrentTotalSupply: {units: "FNX", chain: "BSC", name: "Total Supply @BSC", description: "Current total supply of FNX on BSC"}, 
  wanCurrentTotalSupply: {units: "FNX", chain: "WAN", name: "Total Supply @WAN", description: "Current total supply of FNX on Wanchain"}, 
  maxAmount: {dapp: "N/A", chain: "ALL", name: "Max Supply", description: "Max potential supply of FNX"}, 
//    minted: {dapp: "N/A", chain: "ALL", name: "Minted", description: "Total number of minted FNX"},  
  currentTotalSupply: {units: "FNX", chain: "ALL", name: "Total Supply", description: "Current total supply of FNX (minted FNX minus burnt FNX)"}, 
  opReserves: {units: "FNX", chain: "ALL", name: "Operations Reserve", description: "FNX reserved for operational costs"}, 
  teamAndFounders: {units: "FNX", chain: "ALL", name: "Team Reserve", description: "FNX reserved for team and founding investors"},
  communityRewards: {units: "FNX", chain: "ALL", name: "Community Rewards", description: "Community rewards fund (for liquidity mining and DAO)"},
  institutional1: {units: "FNX", chain: "ALL", name: "Institutional R1 Reserve", description: "FNX reserved for institutional investors R1"},
  institutional2: {units: "FNX", chain: "ALL", name: "Institutional R2 Reserve", description: "FNX reserved for institutional investors R2"},
  InsuranceReserve: {units: "FNX", chain: "ALL", name: "Insurance Reserve", description: "FNX reserved for Insurance"},
  burned: {units: "FNX", chain: "ALL", name: "Burnt", description: "Total amount of burnt FNX"},
  fnxCirculatingSupply: {units: "FNX", chain: "ALL", name: "Circulating", description: "Total amount of FNX in circulation (minted FNX minus reserved & burnt FNX)"},
  effectiveCirculatingSupply: {units: "FNX", chain: "ALL", name: "Effective Circulating", description: "Effective circulating supply of FNX (circulating FNX minus locked FNX)"},
  stakingRate: {units:"%",name:"Staking Rate",chain: "ALL",description:"The percentage of circulating FNX which is locked in FPO"} 
}
app.get("*", (req, res) => {
  if (req.url.length == 1){
    res.json(req.chainData)
  }else{
    let key = req.url.slice(1);
    if(key == "ranges"){
      res.json(req.ranges)
    }
    else if(key == "fnxCirculatingSupply" || key == "fnx-in-circulation" || key == "fnx-circulating-supply"){
      res.json(req.chainData.fnxCirculatingSupply)
    }else{
      res.json(req.chainData[key])
    }
  }

})
/*
app.get("/fpoTvl", (req, res) => {
  var url = req.url;
  console.log(url);
  //res.json(url, name)
  res.json(req.chainData.fpoTvl)
})
app.get("/fpoTvlEth", (req, res) => {
  res.json(req.chainData.fpoTvlEth)
})
app.get("/fpoTvlWan", (req, res) => {
  res.json(req.chainData.fpoTvlWan)
})
app.get("/fpoTvlBsc", (req, res) => {
  res.json(req.chainData.fpoTvlBsc)
})
app.get("/wan_wanPoolTotalValue", (req, res) => {
  res.json(req.chainData.wan_wanPoolTotalValue)
})
app.get("/eth_fnxPoolTotalValue", (req, res) => {
  res.json(req.chainData.eth_fnxPoolTotalValue)
})
app.get("/eth_usdcPoolTotalValue", (req, res) => {
  res.json(req.chainData.eth_usdcPoolTotalValue)
})
app.get("/wan_fnxPoolTotalValue", (req, res) => {
  res.json(req.chainData.wan_fnxPoolTotalValue)
})
app.get("/wan_wanPoolTotal", (req, res) => {
  res.json(req.chainData.wan_wanPoolTotal)
})
app.get("/eth_fnxPoolTotal", (req, res) => {
  res.json(req.chainData.eth_fnxPoolTotal)
})
app.get("/eth_usdcPoolTotal", (req, res) => {
  res.json(req.chainData.eth_usdcPoolTotal)
})
app.get("/wan_fnxPoolTotal", (req, res) => {
  res.json(req.chainData.wan_fnxPoolTotal)
})

app.get("/maxAmount", (req, res) => {
  res.json(req.chainData.maxAmount)
})

app.get("/ethCurrentTotalSupply", (req, res) => {
  res.json(req.chainData.ethCurrentTotalSupply)
})

app.get("/wanCurrentTotalSupply", (req, res) => {
  res.json(req.chainData.wanCurrentTotalSupply)
})

app.get("/ethCurrentTotalSupplyRaw", (req, res) => {
  res.json(req.chainData.ethCurrentTotalSupplyRaw)
})

app.get("/wanCurrentTotalSupplyRaw", (req, res) => {
  res.json(req.chainData.wanCurrentTotalSupplyRaw)
})


app.get("/communityRewards", (req, res) => {
  res.json(req.chainData.communityRewards)
})

app.get("/ethCurrentTotalSupplyRawDecimals", (req, res) => {
  res.json(req.chainData.ethCurrentTotalSupplyRawDecimals)
})

app.get("/wanCurrentTotalSupplyRawDecimals", (req, res) => {
  res.json(req.chainData.wanCurrentTotalSupplyRawDecimals)
})


app.get("/minted", (req, res) => {
  res.json(req.chainData.minted)
})

app.get("/currentTotalSupply", (req, res) => {
  res.json(req.chainData.currentTotalSupply)
})

app.get("/currentTotalSupplyDecimals", (req, res) => {
  res.json(req.chainData.currentTotalSupplyDecimals)
})

app.get("/currentTotalSupplyRaw", (req, res) => {
  res.json(req.chainData.currentTotalSupplyRaw)
})


app.get("/currentTotalSupplyRawDecimals", (req, res) => {
  res.json(req.chainData.currentTotalSupplyRawDecimals)
})

app.get("/opReserves", (req, res) => {
  res.json(req.chainData.opReserves)
})

app.get("/teamAndFounders", (req, res) => {
  res.json(req.chainData.teamAndFounders)
})

app.get("/institutional", (req, res) => {
  res.json(req.chainData.institutional)
}) 

app.get(/^\/burnt$|^\/burned$/i, (req, res) => {
  res.json(req.chainData.burned)
})

app.get(/^\/fnxCirculatingSupply$|^\/fnx-in-circulation$|^\/fnx-circulating-supply$/i, (req, res) => {
  res.json(req.chainData.fnxCirculatingSupply)
})

app.get("/fnxCirculatingSupplyRaw", (req, res) => {
  res.json(req.chainData.fnxCirculatingSupplyRaw)
})

app.get("/fnxCirculatingSupplyRawDecimals", (req, res) => {
  res.json(req.chainData.fnxCirculatingSupplyRawDecimals)
})

app.get("/effectiveCirculatingSupply", (req, res) => {
  res.json(req.chainData.effectiveCirculatingSupply)
})

app.get('/', (req, res) => {
  res.json(req.chainData)
})

app.get("/ranges", (req, res) => {
  res.json(req.ranges)
})

app.get("/fnx-price", (req, res) => {
  res.json(req.chainData.fnxPrice)
})


app.get("/fnxCirculatingSupplyEth", (req, res) => {
  res.json(req.chainData.fnxCirculatingSupplyEth)
})


app.get("/fnxCirculatingSupplyWan", (req, res) => {
  res.json(req.chainData.fnxCirculatingSupplyWan)
})
*/
module.exports = app