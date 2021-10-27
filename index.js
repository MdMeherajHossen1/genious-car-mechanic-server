const express = require('express');
require('dotenv').config()
// const axios = require('axios');
const { MongoClient } = require('mongodb');

const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.json())
const objectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtipi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('jenious-car-mechanic')
        const servicesCollection = database.collection('services')
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.json(result)
        })
        // get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            console.log(cursor)
            const services = await cursor.toArray()
            res.json(services)
        })
        // get specpic one
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: objectId(id) }
            const service = await servicesCollection.findOne(quary)
            res.json(service)
        })

        // delete API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: objectId(id) }
            const service = await servicesCollection.deleteOne(quary)
            res.json(service)
        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('jenious cars mechanisc server')
})

app.listen(port, () => {
    console.log('listening port is ', port)
})


