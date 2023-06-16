const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ik2bdct.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection

    const toyCollection = client.db("toybiz").collection("allToy");
    const usersCollection = client.db("toybiz").collection("users");

    
    app.get('/allToy', async(req, res) =>{
        const result = await toyCollection.find().toArray();
        res.send(result);
    });

    app.post('/allToy', async (req, res) => {
        const newItem = req.body;
        const result = await toyCollection.insertOne(newItem);
        res.send(result);
      })
      app.delete('/allToy/:id', async (req, res) => {
        const id = req.params.id;
        const query= {_id: new ObjectId(id) };
        const result = await toyCollection.deleteOne(query);
        res.send(result);
      })

    app.post('/users', async (req, res) => {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      })
      
      app.get('/allToy/:id',async (req, res) => {
        const id = req.params.id;
      
        // Access the MongoDB collection and perform the query
        // const collection = client.db('toybiz').collection('allToy"');
        const result= await toyCollection.findOne({ _id: new ObjectId(id) }, (err, result) => {
          if (err) {
            console.error('Error retrieving data from MongoDB:', err);
            res.status(500).send('Internal Server Error');
            return;
          }
      
          if (!result) {
            res.status(404).send('Data not found');
            return;
          }
      
          res.json(result);
        });
        res.send(result);
      });
      
    //   app.get('/allToy/:id', (req, res) => {
    //     const id = req.params.id;
    //     const selectedToy = toyCollection.find(n => n._id === id);
    //     res.send(selectedToy)
    // })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

  
  


app.get('/', (req, res) => {
    res.send('toybiz is running')
})

app.listen(port, () => {
    console.log(`toybiz running on port: ${port}`)
})