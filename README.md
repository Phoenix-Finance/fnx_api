# FinNexus FNX Token API v0.1 Alpha
This is an API for getting data about the FNX token and the FinNexus Options Protocol on the Wanchain blockchain.

[Live api: https://fnx-api.herokuapp.com/api/v1](https://fnx-api.herokuapp.com/api/v1)

The API makes use of Web3 to interact directly with the blockchain and also uses smart contract ABIs to connect with smart contract addresses and get access to their functions and events. 

A single route at `/api/v1` returns all of the API data, while individual pieces of data may also be queried at the specific routes listed below.

See [https://www.docs.finnexus.io/](https://www.docs.finnexus.io/) for detailed info about all available routes and for more info about FinNexus and the FinNexus Protocol for Options.

# Get Started Locally:
```
$ npm install
$ npm start
```