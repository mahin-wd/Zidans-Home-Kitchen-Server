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

        const ratings = client.db('zidansKitchen').collection('ratings');

        app.post('/rating', async(req, res) => {
            const rating = req.body;
            const result = await ratings.insertOne(rating);
            req.send(result);
        });

        app.get('/ratings', async(req, res) => {
            const query = {};
            const cursor = ratings.find(query);
            const allRatings = await cursor.toArray();
            res.send(allRatings);
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

