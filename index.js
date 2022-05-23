const express = require('express');
const app = express();
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config()

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dctmt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('computerParts').collection('Cparts')
        const reviewCollection = client.db('computerParts').collection('Review')
        const orderCollection = client.db('computerParts').collection('order')
        //get
        app.get('/part', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query)
            const user = await cursor.toArray()
            res.send(user)
        })
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query)
            const user = await cursor.toArray()
            res.send(user)
        })
        
        app.post('/review', async (req, res) => {
            const newProduct = req.body
            console.log(newProduct);
            const result = await reviewCollection .insertOne(newProduct)
            res.send(result)
        })

        app.get('/part/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await partsCollection.findOne(query);
            res.send(service);
        })
    
        app.put('/part/:id', async (req, res) => {
            const id = req.params.id;
            const updatUser = req.body;
            console.log(updatUser);
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    orderquantity: updatUser.orderquantity,
                

                }
            };
            const result = await partsCollection.updateOne(filter, updateDoc, option)
            res.send(result);
        });
        // app.post('/addItem', async (req, res) => {
        //     const newService = req.body;
        //     console.log(newService);
        //     const result = await partsCollection.insertOne(newService);
        //     res.send(result);
        // });

       
        app.get('/addItem', async (req, res) => {
            const query = {}
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });

        // insert new product
        app.post('/addItem', async (req, res) => {
            const newService = req.body;
            const result = await orderCollection.insertOne(newService);
            res.send(result);
        });

        // query by email
        app.get("/myorder/:email", async (req, res) => {
            const email = req.params;
            const cursor = orderCollection.find(email)
            const products = await cursor.toArray()
            res.send(products)
        });

        // delete part

        app.delete('/myorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })
        
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my  server')
})

app.listen(port, () => {
    console.log(' server is running ');
})