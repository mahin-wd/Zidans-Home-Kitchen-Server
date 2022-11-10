const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require ('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

//* mongodb....
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4lqljgn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async  function run() {
    try {
        const itemCollection = client.db('zidansKitchen').collection('items');

        app.get('/food-item', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query).limit(3);
            const foods = await cursor.toArray();
            res.send(foods);
        })

        app.get('/food-items', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const foods = await cursor.toArray();
            res.send(foods);
        });

        app.get('/food-items/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const food = await itemCollection.findOne(query);
            res.send(food);
        })

        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = await itemCollection.insertOne(service);
            res.send(result);
        });

        const reviewItems = client.db('zidansKitchen').collection('review');

        app.get('/reviews', async(req, res) => {
            const query = {};
            const cursor = reviewItems.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewItems.insertOne(review);
            res.send(result);
        });

        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewItems.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

