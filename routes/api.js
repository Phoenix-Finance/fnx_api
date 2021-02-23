const express = require('express')
const app = express.Router()
 

app.get("/fpoTvl", (req, res) => {
  res.json(req.chainData.fpoTvl)
})
app.get("/fpoTvlEth", (req, res) => {
  res.json(req.chainData.fpoTvlEth)
})
app.get("/fpoTvlWan", (req, res) => {
  res.json(req.chainData.fpoTvlWan)
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

module.exports = app