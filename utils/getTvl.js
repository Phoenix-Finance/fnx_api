const fpoProxyAbi = require("../abi/collateralPoolAbi.json");
const oracleAbi = require("../abi/oracle.json");
const Web3 = require("web3")
const BigNumber = require("bignumber.js");
const numeral = require("numeral");
const dataEngine =  require('./multicall.js');
//Define all ETH addresses
const eth_fnx = {
    address : "0xef9cd7882c067686691b6ff49e650b43afbbcc6b",
    name : "FNX",
    decimals: 18
  }
  const eth_usdc = {
    address : "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    name : "USDC",
    decimals: 6
  }
  const eth_usdt = {
    address : "0xdac17f958d2ee523a2206206994597c13d831ec7",
    name : "USDT",
    decimals: 6
  }
  const eth_frax = {
    address : "0x853d955acef822db058eb8505911ed77f175b99e",
    name : "FRAX",
    decimals: 18
  }
  const bsc_fnx = {
    address : "0xdFd9e2A17596caD6295EcFfDa42D9B6F63F7B5d5",
    name : "FNX",
    decimals: 18
  }
  const bsc_busd = {
    address : "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    name : "BUSD",
    decimals: 18
  }
  const bsc_usdt = {
    address : "0x55d398326f99059ff775485246999027b3197955",
    name : "BUSDT",
    decimals: 18
  }
  const wan_fnx = {
    address : "0xC6F4465A6a521124C8e3096B62575c157999D361",
    name : "FNX",
    decimals: 18
  }
  const wan_wan = {
    address : "0x0000000000000000000000000000000000000000",
    name : "WAN",
    decimals: 18
  }
  const wan_usdt = {
    address : "0x11e77e27af5539872efed10abaa0b408cfd9fbbd",
    name : "WANUSDT",
    decimals: 6
  }
  // Set number formatting default

  
  // For converting to proper number of decimals
  const convertNum = (num, decimal) => {
    return Math.round((num / (10*10**(decimal-3))))/100
  }
  let oracles = {
    ETH : "0x43BD92bF3Bb25EBB3BdC2524CBd6156E3Fdd41F3",
    WAN: "0x75456e0EC59D997eB5cb705DAB2958f796D698Bb",
    BSC : "0x5fb39bdfa86f1a6010cd816085c2146776f08aac",
  }
  let fptPools = {
      ETH : [
        {
            address : "0xff60d81287bf425f7b2838a61274e926440ddaa6",
            tokens :[eth_usdc,eth_usdt]
          },{
            address : "0x6f88e8fbF5311ab47527f4Fb5eC10078ec30ab10",
            tokens :[eth_frax]
          },{
            address : "0x919a35a4f40c479b3319e3c3a2484893c06fd7de",
            tokens :[eth_fnx]
          }
      ],
      WAN : [
        {
            address : "0x297ff55afef50c9820d50ea757b5beba784757ad",
            tokens :[wan_usdt]
          },
          {
            address : "0xe96e4d6075d1c7848ba67a6850591a095adb83eb",
            tokens :[wan_fnx,wan_wan]
          }
      ],
      BSC : [{
        address : "0xa3f70add496d2c1c2c1be5514a5fcf0328337530",
        tokens :[bsc_busd,bsc_usdt]
      },{
        address : "0xf2e1641b299e60a23838564aab190c52da9c9323",
        tokens :[bsc_fnx]
      }]
  }
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

  const denominator = new BigNumber("100000000000000000000000000");
  const ether = new BigNumber("1000000000000000000");
  function calculateFnxLiquidity(wanRet,ethRet,bscRet){
    let burned = 322324e18;
    let totalSupply = ethRet.ETHtotalSupply;
    itemInfo.burned.value = wanRet.WANburn.plus(ethRet.ETHburn).plus(bscRet.BSCburn).plus(burned).plus(wanRet.um1s.multipliedBy(10));
    itemInfo.maxAmount.value = 500000000;
    totalSupply = totalSupply.minus(ethRet.ETHburn).minus(burned);
    itemInfo.currentTotalSupply.value = totalSupply.dividedBy(ether);
    itemInfo.bscCurrentTotalSupply.value = bscRet.BSCtotalSupply.minus(bscRet.BSCburn).dividedBy(ether);
    itemInfo.wanCurrentTotalSupply.value = wanRet.WANtotalSupply.minus(wanRet.WANburn).minus(wanRet.WANStoreman).dividedBy(ether);
    itemInfo.ethCurrentTotalSupply.value = totalSupply.dividedBy(ether).minus(itemInfo.wanCurrentTotalSupply.value).minus(itemInfo.bscCurrentTotalSupply.value);
    itemInfo.opReserves.value = ethRet.Reserves.dividedBy(ether);
    itemInfo.teamAndFounders.value = ethRet.teamAndFounders.dividedBy(ether);
    itemInfo.communityRewards.value = ethRet.communityRewards.dividedBy(ether);
    itemInfo.institutional1.value = ethRet.institutional1.dividedBy(ether);
    itemInfo.institutional2.value = ethRet.institutional2.dividedBy(ether);
    itemInfo.InsuranceReserve.value = ethRet.InsuranceReserve.dividedBy(ether);
    itemInfo.burned.value = itemInfo.burned.value.dividedBy(ether);
    itemInfo.fnxCirculatingSupply.value = itemInfo.currentTotalSupply.value.minus(itemInfo.opReserves.value).minus(
      itemInfo.teamAndFounders.value).minus(itemInfo.communityRewards.value).minus(itemInfo.institutional1.value).minus(
        itemInfo.institutional2.value).minus(itemInfo.InsuranceReserve.value);
    let wanLocked = wanRet.WANfnxPoolFNX_TotalValue.plus(wanRet.WANconvert).dividedBy(ether);
    let ethLocked = ethRet.ETHfnxPoolFNX_TotalValue.plus(ethRet.ETHconvert).dividedBy(ether);
    let bscLocked = bscRet.BSCfnxPoolFNX_TotalValue.plus(bscRet.BSCconvert).dividedBy(ether);
    itemInfo.effectiveCirculatingSupply.value = itemInfo.fnxCirculatingSupply.value.minus(wanLocked).minus(ethLocked).minus(bscLocked)
    itemInfo.stakingRate.value = itemInfo.effectiveCirculatingSupply.value.multipliedBy(100).dividedBy(itemInfo.fnxCirculatingSupply.value);
  }
  function calWanTotalValue(wanRet,ethRet,bscRet){
    itemInfo.wan_wanPoolTotal.value = wanRet.WANfnxPoolWAN_TotalValue.dividedBy(ether);
    itemInfo.wan_fnxPoolTotal.value = wanRet.WANfnxPoolFNX_TotalValue.dividedBy(ether);
    itemInfo.wan_usdtPoolTotal.value = wanRet.WANfnxPoolFNX_TotalValue.dividedBy(new BigNumber(1e6));
    itemInfo.wan_wanPoolTotalValue.value = wanRet.WANfnxPoolWAN_TotalValue.multipliedBy(wanRet.WANprice).dividedBy(denominator);
    itemInfo.wan_fnxPoolTotalValue.value = wanRet.WANfnxPoolFNX_TotalValue.multipliedBy(ethRet.FNXprice).dividedBy(denominator);
    itemInfo.wan_usdtPoolTotalValue.value = wanRet.WANusdtPoolUSDT_TotalValue.multipliedBy(ethRet.USDTprice).dividedBy(denominator);
    itemInfo.fpoTvlWan.value = itemInfo.wan_wanPoolTotalValue.value.plus(itemInfo.wan_usdtPoolTotalValue.value).plus(itemInfo.wan_fnxPoolTotalValue.value);
  }
  function calETHTotalValue(wanRet,ethRet,bscRet){
    itemInfo.eth_fnxPoolTotal.value = ethRet.ETHfnxPoolFNX_TotalValue.dividedBy(ether);
    itemInfo.eth_usdcPoolTotal.value = ethRet.ETHusdcPoolUSDC_TotalValue.dividedBy(new BigNumber(1e6));
    itemInfo.eth_usdtPoolTotal.value = ethRet.ETHusdcPoolUSDT_TotalValue.dividedBy(new BigNumber(1e6));
    itemInfo.eth_fraxPoolTotal.value = ethRet.ETHfraxPoolFRAX_TotalValue.dividedBy(ether);
    itemInfo.eth_fnxPoolTotalValue.value = ethRet.ETHfnxPoolFNX_TotalValue.multipliedBy(ethRet.FNXprice).dividedBy(denominator);
    itemInfo.eth_usdcPoolTotalValue.value = ethRet.ETHusdcPoolUSDC_TotalValue.multipliedBy(ethRet.USDCprice).dividedBy(denominator);
    itemInfo.eth_usdtPoolTotalValue.value = ethRet.ETHusdcPoolUSDT_TotalValue.multipliedBy(ethRet.USDTprice).dividedBy(denominator);
    itemInfo.eth_fraxPoolTotalValue.value = ethRet.ETHfraxPoolFRAX_TotalValue.multipliedBy(ethRet.FRAXprice).dividedBy(denominator);
    itemInfo.fpoTvlEth.value = itemInfo.eth_fnxPoolTotalValue.value.plus(itemInfo.eth_usdcPoolTotalValue.value)
      .plus(itemInfo.eth_usdtPoolTotalValue.value).plus(itemInfo.eth_fraxPoolTotalValue.value);
  }
  function calBSCTotalValue(wanRet,ethRet,bscRet){
    itemInfo.bsc_fnxPoolTotal.value = bscRet.BSCfnxPoolFNX_TotalValue.dividedBy(ether);
    itemInfo.bsc_busdtPoolTotal.value = bscRet.BSCbusdPoolBUSDT_TotalValue.dividedBy(ether);
    itemInfo.bsc_busdPoolTotal.value = bscRet.BSCbusdPoolBUSD_TotalValue.dividedBy(ether);
    itemInfo.bsc_fnxPoolTotalValue.value = bscRet.BSCfnxPoolFNX_TotalValue.multipliedBy(ethRet.FNXprice).dividedBy(denominator);
    itemInfo.bsc_busdtPoolTotalValue.value = bscRet.BSCbusdPoolBUSDT_TotalValue.multipliedBy(bscRet.BUSDTprice).dividedBy(denominator);
    itemInfo.bsc_busdPoolTotalValue.value = bscRet.BSCbusdPoolBUSD_TotalValue.multipliedBy(bscRet.BUSDprice).dividedBy(denominator);
    itemInfo.fpoTvlBsc.value = itemInfo.bsc_fnxPoolTotalValue.value.plus(itemInfo.bsc_busdtPoolTotalValue.value).plus(itemInfo.bsc_busdPoolTotalValue.value);
  }
  function calculateTotalValue(wanRet,ethRet,bscRet){
    calWanTotalValue(wanRet,ethRet,bscRet);
    calETHTotalValue(wanRet,ethRet,bscRet);
    calBSCTotalValue(wanRet,ethRet,bscRet);
    itemInfo.fpoTvl.value = itemInfo.fpoTvlWan.value.plus(itemInfo.fpoTvlEth.value).plus(itemInfo.fpoTvlBsc.value);
  }
module.exports = async function getTvl(){
    let wanRet = await dataEngine("WAN");
    let ethRet = await dataEngine("ETH");
    let bscRet = await dataEngine("BSC");
    calculateFnxLiquidity(wanRet.transformed,ethRet.transformed,bscRet.transformed);
    calculateTotalValue(wanRet.transformed,ethRet.transformed,bscRet.transformed);
    for (var key in itemInfo){
      itemInfo[key].formattedValue = numeral(itemInfo[key].value).format();
      itemInfo[key].value = Number(itemInfo[key].value);
      itemInfo[key].blockWan = Number(wanRet.blockNumber);
      itemInfo[key].blockEth = Number(ethRet.blockNumber);
      itemInfo[key].blockBSc = Number(bscRet.blockNumber);
      itemInfo[key].timeStamp = Date()
    }
    itemInfo.blockWan = Number(wanRet.blockNumber);
    itemInfo.blockEth = Number(ethRet.blockNumber);
    itemInfo.blockBsc = Number(bscRet.blockNumber);
    itemInfo.ethCurrentTotalSupplyRaw = itemInfo.ethCurrentTotalSupply.value*1e18;
    itemInfo.ethCurrentTotalSupplyRawDecimals = itemInfo.ethCurrentTotalSupply.value;
    itemInfo.wanCurrentTotalSupplyRaw = itemInfo.wanCurrentTotalSupply.value*1e18;
    itemInfo.wanCurrentTotalSupplyRawDecimals = itemInfo.wanCurrentTotalSupply.value;
    itemInfo.bscCurrentTotalSupplyRaw = itemInfo.bscCurrentTotalSupply.value*1e18;
    itemInfo.bscCurrentTotalSupplyRawDecimals = itemInfo.bscCurrentTotalSupply.value;
    itemInfo.currentTotalSupplyRaw = itemInfo.currentTotalSupply.value*1e18;
    itemInfo.currentTotalSupplyRawDecimals = itemInfo.currentTotalSupply.value;
    itemInfo.fnxCirculatingSupplyRaw = itemInfo.fnxCirculatingSupply.value*1e18;
    itemInfo.fnxCirculatingSupplyRawDecimals = itemInfo.fnxCirculatingSupply.value;
    itemInfo.fnxCirculatingSupplyWan = itemInfo.wanCurrentTotalSupply.value;
    itemInfo.fnxCirculatingSupplyBsc = itemInfo.bscCurrentTotalSupply.value;
    itemInfo.fnxCirculatingSupplyEth = itemInfo.fnxCirculatingSupplyRawDecimals-itemInfo.fnxCirculatingSupplyWan-itemInfo.fnxCirculatingSupplyBsc;
    itemInfo.timeStamp = Math.floor(Date.now()/1000);
    itemInfo.fnxPrice = Number(ethRet.transformed.FNXprice)/1e8;
    return itemInfo;
  }