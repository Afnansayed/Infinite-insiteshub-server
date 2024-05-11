const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT|| 5000;

//MIDDLE WIRE
app.use(cors());
app.use(express.json());


//MONGODB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khblnbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const blogsCollection = client.db('blogsDB').collection('allBlogs');
    const commentCollection = client.db('blogsDB').collection('allComments');
    //Api related  data
   app.get('/allBlogs',async(req,res) =>{
         const cursor = blogsCollection.find();
         const result = await cursor.toArray();
         res.send(result);
   })
   //get single data 
   app.get('/allBlogs/:id',async(req,res) =>{
         const id = req.params.id;
         const query = {_id: new ObjectId(id)};
         const result = await blogsCollection.findOne(query);
         res.send(result);
   })

    app.post('/allBlogs',async(req,res) => {
        const blog = req.body;
        console.log(req.body);
        const result = await blogsCollection.insertOne(blog);
        res.send(result);
    })
     //comment 
     app.get('/allComments',async(req,res) =>{
               let query = {};
               if(req.query?.fin){
                query = {fin: req.query.fin};
               }
              // const ir = req.params.id;
              // const  query = {fin: ir};
               const result = await commentCollection.find(query).toArray();
               res.send(result)
     })
    //comments post
     app.post('/allComments', async(req,res) =>{
              const commentInfo = req.body;
              const result = await commentCollection.insertOne(commentInfo)
              res.send(result);
     })
     

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Assignment 11 server is running");
})

app.listen(port,() => {
    console.log('Assignment 11 server is running on port ',port);
})