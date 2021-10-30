const express = require('express')
const cors = require('cors');
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = 5000;

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
    console.log("connected");
    app.get("/popular", async (req, res) => {
      const cursor = mostPopular.find({});
      const result = await cursor.toArray();
      console.log("gettind the reuslt");
      res.json(result);
    })
    app.get("/services", async (req, res) => {
      const anything = allServices.find({});
      const services = await anything.toArray();
      console.log("getting the services");
      res.json(services);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})