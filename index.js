const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.get('/food-items', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const foods = await cursor.toArray();
            const count = await itemCollection.estimatedDocumentCount();
            res.send({count, foods});
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

