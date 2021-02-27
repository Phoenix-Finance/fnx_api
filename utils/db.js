const { ObjectId } = require('mongodb')
const MongoClient = require('mongodb').MongoClient;


const initializeClient = () => {
    try {
        const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@fnx-api.9fp5u.azure.mongodb.net/cache?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
        client.connect();
        const getClient = () => client
        return {client, getClient}
    }
    catch(err) {
        console.log(err)
    }
}

const { client, getClient } = initializeClient()

 
updateChainData = async (chainData, client) => {
    try {
        const database = client.db('cache');
        const collection = database.collection('shortterm');
        let newChainData = Object.assign({}, chainData)
        newChainData._id = ObjectId()
        await collection.insertOne(newChainData)
        await collection.deleteMany( { timeStamp : {"$lt" : Date.now() - 60 * 60 * 24 * 1000 }}) 
    } 
    catch(err) {
        console.log(err)
    }
}

getCachedData = async (client) => {
    try {
        const database = client.db('cache');
        const collection = database.collection('shortterm');
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray();
        cachedData = cachedData[0];
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}

updateDataRanges = async (newRanges, client) => {
    try {
        const database = client.db('cache');
        const collection = database.collection('ranges');
        let updatedRanges = Object.assign({}, newRanges)
        updatedRanges._id = ObjectId()
        await collection.insertOne(updatedRanges)
        await collection.deleteMany( { timeStamp : {"$lt" : Date.now() - 60 * 60 * 24 * 1000 }}) 
    } 
    catch(err) {
        console.log(err)
    }
}

getCachedDataRanges = async (client) => {
    try {
        const database = client.db('cache');
        const collection = database.collection('ranges');
        cachedData = await collection.find().sort({ _id: -1 }).limit(1).toArray();
        cachedData = cachedData[0];
        return cachedData    
    } 
    catch(err) {
        console.log(err)
    }
}


module.exports = {
    getClient,
    updateChainData,
    getCachedData,
    updateDataRanges,
    getCachedDataRanges
}

