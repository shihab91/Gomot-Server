const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvkvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db('gomoto');
    const allServices = database.collection("services");
    const mostPopular = database.collection("mostPopularServices");
    const orders = database.collection("orders");
    console.log("connected");
    // GET ALL THE POPULAR SERVICES
    app.get("/popular", async (req, res) => {
      const cursor = mostPopular.find({});
      const result = await cursor.toArray();
      res.json(result);
    })
    // GET ALL THE MAIN SERVICES
    app.get("/services", async (req, res) => {
      const anything = allServices.find({});
      const services = await anything.toArray();
      res.json(services);
    })
    // GET SINGLE SERVICE BY _ID
    app.get("/services/:id", async (req, res) => {
      const query = req.params.id;
      const singleService = await allServices.findOne({ _id: ObjectId(query) });
      res.json(singleService)
    })

    // POST AN ORDER
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orders.insertOne(order);
      res.json(result);
    })
    app.get('/orders', async (req, res) => {
      const cursor = orders.find({});
      const result = await cursor.toArray();
      res.json(result);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('welcome home')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})