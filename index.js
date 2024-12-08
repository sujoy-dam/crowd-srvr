require('dotenv').config()
const express = require("express")
const cors = require("cors");
// const corsConfig = {
//   origin: '',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json())


// cJCTDh1RUsMKnb1i
// crowd-cube
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)


// const uri = "mongodb+srv://crowd-cube:cJCTDh1RUsMKnb1i@cluster0.bsuta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://crowd-cube:cJCTDh1RUsMKnb1i@cluster0.bsuta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // const database = client.db("campaignDB");
    // const haiku = database.collection("haiku");
    const donationCollection = client.db("campaignDB").collection("campaigns")
    const usersCollection = client.db("campaignDB").collection("users")
    const donatedCollection = client.db("campaignDB").collection('donatedCollection')

    // donated collection 
    app.post('/donated', async (req, res) => {
      const newDonate = req.body;
      const result = await donatedCollection.insertOne(newDonate)
      res.send(result)
    })
    app.get('/donated', async (req, res) => {
      const cursor = donatedCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/donated-email', async (req, res) => {
      const email = req.query.email;
      // const query={_id: new ObjectId(id)}
      const result = await donatedCollection.find({ email: email }).toArray();
      res.send(result)
    })
    // users api start 
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser)
      res.send(result)
    })
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.put('/users', async (req, res) => {
      const email = req.body.email;
      const filter = { email }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          lastSignInTime: req.body.lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // users api finished -------------------------------------------------------------------
    // ---------------------------

    app.get("/campaign/all", async (req, res) => {
      const cursor = donationCollection.find();
      // const cursor = donationCollection.find().limit(6);
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/campaign/all/sort", async (req, res) => {
      const cursor = donationCollection.find().sort({ amount: -1 });
      // const cursor = donationCollection.find().limit(6);
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/campaign", async (req, res) => {
      const cursor = donationCollection.find().limit(6);
      // const cursor = donationCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // app.get('/', async(req,res)=>{
    //   const
    // })

    app.post("/campaign", async (req, res) => {
      const newCampaign = req.body;
      // const result = await donationCollection.insertOne(newCampaign)
      const result = await donationCollection.insertOne(newCampaign)
      console.log(result)
      // res.send(result)
      res.send(result)
    })
    app.delete("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await donationCollection.deleteOne(query)
      res.send(result)
    })
    app.get('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await donationCollection.findOne(query)
      res.send(result)
    })
    app.patch('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          image: req.body.image,
          title: req.body.title,
          type: req.body.type,
          description: req.body.description,
          amount: req.body.amount,
          deadline: req.body.deadline,
        }
      }
      const result = await donationCollection.updateOne(filter, updateDoc)
      res.send(result)
    })


    // find email 
    app.get('/campaign-email', async (req, res) => {
      const email = req.query.email;
      // const query={_id: new ObjectId(id)}
      const result = await donationCollection.find({ email: email }).toArray();
      res.send(result)
    })
    // })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('CrowdCube server is running')
})

app.listen(port, () => {
  console.log(`Crowd Cube is running on port: ${port}`)
})