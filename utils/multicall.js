const { aggregate } = require('@makerdao/multicall');
const BigNumber = require("bignumber.js");
function pullPriceCall(platForm,calls){
    if (platForm == "WAN"){
        calls.push(
            {
                target : oracles[platForm],
                call: ['getPrice(address)(uint256)',tokens.wan_wan.address],
                returns: [
                  [tokens.wan_wan.name+"price", val => new BigNumber(val.toString())],
                ]
            }
        )
    }else if(platForm == "ETH"){
        calls.push(
            {
                target : oracles[platForm],
                call: ['getPrice(address)(uint256)',tokens.eth_fnx.address],
                returns: [
                  [tokens.eth_fnx.name+"price", val => new BigNumber(val.toString())],
                ]
            },{
                target : oracles[platForm],
                call: ['getPrice(address)(uint256)',tokens.eth_usdc.address],
                returns: [
                  [tokens.eth_usdc.name+"price", val => new BigNumber(val.toString())],
                ]
            },{
                target : oracles[platForm],
                call: ['getPrice(address)(uint256)',tokens.eth_usdt.address],
                returns: [
                  [tokens.eth_usdt.name+"price", val => new BigNumber(val.toString())],
                ]
            },{
                target : oracles[platForm],
                call: ['getPrice(address)(uint256)',tokens.eth_frax.address],
                returns: [
                  [tokens.eth_frax.name+"price", val => new BigNumber(val.toString())],
                ]
            }
        )
    }else{
        calls.push(
            {
                target : oracles[platForm],
                call: ['getPrice(address)(uint256)',tokens.bsc_busd.address],
                returns: [
                  [tokens.bsc_busd.name+"price", val => new BigNumber(val.toString())],
                ]
            },{
                target : oracles[platForm],
                call: ['getPrice(address)(uint256)',tokens.bsc_usdt.address],
                returns: [
                  [tokens.bsc_usdt.name+"price", val => new BigNumber(val.toString())],
                ]
            }
        )
    }
}
const communityRewardsAddress = "0x0d3e9966d367be9d2c0af22fd5a6a35303d7dc9d"
const opReservesAddress = "0x4cd9dc880765b77865846a22f85712c6008ff352"
const InsuranceReserve = "0xca3df6f1008a4e5a5dc028c38967448658d764de"
const teamAndFoundersAddress = "0xad7bfb3f58a47d9597c4b9f38d6430d8cd3587dd"
const um1sConversionAddress = "0xcdf1a03225367263a549d04ed2fd3384ab127895"
const institutional1Adress = "0xdc60f709635314b95ac58c6ac7543bdd411be176"
const institutional2Adress = "0xe4c452ddfeed012042b7215ce105b99988e32edd"
const burnedAddress = "0x0000000000000000000000000000000000000000"
const ethToBscPool = "0xdFd9e2A17596caD6295EcFfDa42D9B6F63F7B5d5"
const ethStoreman = "0xfCeAAaEB8D564a9D0e71Ef36f027b9D162bC334e"
const wanStoreman = "0xDAb498c11f19b25611331CEBFfD840576d1dc86d"
function fnxBalanceCalls(platForm,calls){
    calls.push(
        {
            target : fnxCoins[platForm],
            call: ['totalSupply()(uint256)'],
            returns: [
              [platForm+"totalSupply", val => new BigNumber(val.toString())],
            ]
        },{
            target : fnxCoins[platForm],
            call: ['balanceOf(address)(uint256)',burnedAddress],
            returns: [
              [platForm+"burn", val => new BigNumber(val.toString())],
            ]
        },{
            target : fnxCoins[platForm],
            call: ['balanceOf(address)(uint256)',fnxConvert[platForm]],
            returns: [
              [platForm+"convert", val => new BigNumber(val.toString())],
            ]
        }
    )
    if (platForm == "WAN"){
        calls.push(
            {
              target : fnxCoins[platForm],
              call: ['balanceOf(address)(uint256)',wanStoreman],
              returns: [
                [platForm+"Storeman", val => new BigNumber(val.toString())],
              ]
          },{
            target : um1sConversionAddress,
            //um1s
            call: ['totalSupply()(uint256)'],
            returns: [
              ['um1s', val => new BigNumber(val.toString())],
            ]
        }
        )
    }else if(platForm == "ETH"){
        calls.push(
            { 
              target : fnxCoins[platForm],
              call: ['balanceOf(address)(uint256)',opReservesAddress],
              returns: [
                ['Reserves', val => new BigNumber(val.toString())],
              ]
          },{ 
            target : fnxCoins[platForm],
            call: ['balanceOf(address)(uint256)',InsuranceReserve],
            returns: [
              ['InsuranceReserve', val => new BigNumber(val.toString())],
            ]
        },{
              target : fnxCoins[platForm],
              call: ['balanceOf(address)(uint256)',teamAndFoundersAddress],
              returns: [
                ['teamAndFounders', val => new BigNumber(val.toString())],
              ]
          },
          {
              target : fnxCoins[platForm],
              call: ['balanceOf(address)(uint256)',communityRewardsAddress],
              returns: [
                ['communityRewards', val => new BigNumber(val.toString())],
              ]
          },{
              target : fnxCoins[platForm],
              call: ['balanceOf(address)(uint256)',institutional1Adress],
              returns: [
                ['institutional1', val => new BigNumber(val.toString())],
              ]
          },{
            target : fnxCoins[platForm],
            call: ['balanceOf(address)(uint256)',institutional2Adress],
            returns: [
              ['institutional2', val => new BigNumber(val.toString())],
            ]
          },{
              target : fnxCoins[platForm],
              call: ['balanceOf(address)(uint256)',ethStoreman],
              returns: [
                [platForm+"Storeman", val => new BigNumber(val.toString())],
              ]
          },{
            target : fnxCoins[platForm],
            call: ['balanceOf(address)(uint256)',ethToBscPool],
            returns: [
              ["ethToBscPool", val => new BigNumber(val.toString())],
            ]
        }
        )
    }
}
const MULTI_CALL_ADDR = {
    'ETH': '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    'WAN':'0xBa5934Ab3056fcA1Fa458D30FBB3810c3eb5145f',
    'BSC': '0x023a33445F11C978f8a99E232E1c526ae3C0Ad70'
  }
const RPC_URL = {
    'ETH': "https://mainnet.infura.io/v3/f977681c79004fad87aa00da8f003597",
    'WAN':'https://gwan-ssl.wandevs.org:56891',
    'BSC':'https://bsc-dataseed1.binance.org',
  }
 
  let oracles = {
    'ETH': "0x43BD92bF3Bb25EBB3BdC2524CBd6156E3Fdd41F3",
    'WAN': "0x75456e0EC59D997eB5cb705DAB2958f796D698Bb",
    'BSC': "0x5fb39bdfa86f1a6010cd816085c2146776f08aac",
  }
  let fnxCoins = {
    'ETH': "0xef9cd7882c067686691b6ff49e650b43afbbcc6b",
    'WAN': "0xC6F4465A6a521124C8e3096B62575c157999D361",
    'BSC': "0xdFd9e2A17596caD6295EcFfDa42D9B6F63F7B5d5",      
  }
  let fnxConvert = {
    'ETH': "0x955282b82440f8f69e901380bef2b603fba96f3b",
    'WAN': "0x1db7b24da0ce4e678e4389fd2e4d4008c1dfed71",
    'BSC': "0xa39ca70da0e23921f1c00ac5558f3375b0bd64e1",
  }
  let fnxLocked = {
    'ETH': [],
    'WAN': [],
    'BSC': [],
  }
  let tokens = {
    eth_fnx : {
        address : fnxCoins["ETH"],
        name : "FNX",
        decimals: 18
      },
      eth_usdc : {
        address : "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        name : "USDC",
        decimals: 6
      },
      eth_usdt : {
        address : "0xdac17f958d2ee523a2206206994597c13d831ec7",
        name : "USDT",
        decimals: 6
      },
      eth_frax : {
        address : "0x853d955acef822db058eb8505911ed77f175b99e",
        name : "FRAX",
        decimals: 18
      },
      bsc_fnx : {
        address : fnxCoins["BSC"],
        name : "FNX",
        decimals: 18
      },
      bsc_busd : {
        address : "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        name : "BUSD",
        decimals: 18
      },
      bsc_usdt : {
        address : "0x55d398326f99059ff775485246999027b3197955",
        name : "BUSDT",
        decimals: 18
      },
      wan_fnx : {
        address : fnxCoins["WAN"],
        name : "FNX",
        decimals: 18
      },
      wan_wan : {
        address : "0x0000000000000000000000000000000000000000",
        name : "WAN",
        decimals: 18
      },wan_usdt : {
        address : "0x11e77e27af5539872efed10abaa0b408cfd9fbbd",
        name : "USDT",
        decimals: 6
      }
  }
 
  let fpoPool = [
    {
      platForm : "WAN",
      poolName : "fnxPool",
      address : "0xe96e4d6075d1c7848ba67a6850591a095adb83eb",
      tokens :[tokens.wan_fnx,tokens.wan_wan]
    },{
      platForm : "WAN",
      poolName : "usdtPool",
      address : "0x297ff55afef50c9820d50ea757b5beba784757ad",
      tokens :[tokens.wan_usdt]
    },{
      platForm : "ETH",
      poolName : "fnxPool",
      address : "0x919a35a4f40c479b3319e3c3a2484893c06fd7de",
      tokens :[tokens.eth_fnx]
    },{
      platForm : "ETH",
      poolName : "usdcPool",
      address : "0xff60d81287bf425f7b2838a61274e926440ddaa6",
      tokens :[tokens.eth_usdc,tokens.eth_usdt]
    },{
      platForm : "ETH",
      poolName : "fraxPool",
      address : "0x6f88e8fbF5311ab47527f4Fb5eC10078ec30ab10",
      tokens :[tokens.eth_frax]
    },{
      platForm : "BSC",
      poolName : "fnxPool",
      address : "0xf2e1641b299e60a23838564aab190c52da9c9323",
      tokens :[tokens.bsc_fnx]
    },{
      platForm : "BSC",
      poolName : "busdPool",
      address : "0xa3f70add496d2c1c2c1be5514a5fcf0328337530",
      tokens :[tokens.bsc_busd,tokens.bsc_usdt]
    }
  ] 
module.exports =  async function dataEngine(platForm){
    let calls = [];
    pullPriceCall(platForm,calls);
    fnxBalanceCalls(platForm,calls);
    for (var i=0;i<fpoPool.length;i++){
        let pool = fpoPool[i];
        if (pool.platForm == platForm){
            for (var j=0;j<pool.tokens.length;j++){
                calls.push(
                    {
                        target: pool.address,
                        call: ['getNetWorthBalance(address)(uint256)', pool.tokens[j].address],
                        returns: [[pool.platForm+pool.poolName +pool.tokens[j].name + '_TotalValue', val => (new BigNumber(val.toString()))]]
                    }
                )
            }
        }
    }
    let config =  {
        rpcUrl: RPC_URL[platForm],
        multicallAddress: MULTI_CALL_ADDR[platForm],
      }
    let ret = await aggregate(calls, config);
    console.debug('☆☆☆☆☆☆☆dataEngine aggregate return☆☆☆☆☆☆☆', ret);
    return ret.results;
}

