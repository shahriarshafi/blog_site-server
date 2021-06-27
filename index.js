const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
const fs = require('fs-extra')
const cors =require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT ||6055;
 app.use(cors());
 app.use(fileUpload());
 app.use(bodyParser.json())
 app.use = bodyParser.urlencoded({ extended: false })
 
app.get('/', (req, res) => {
  res.send('Hello World!')
})
 
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.taqt5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db("blogData").collection("blogs");
 

  //blogs collection pages
 
   app.post('/addBlogs', (req, res) => {
    const image = req.body.file;
    const blogTitles = req.body.title;
    const blogDate = req.body.date;
    const description = req.body.description;
     
        blogCollection.insertOne({ blogTitles, description, blogDate, image })
            .then(result => {
                
                    res.send(result.insertedCount > 0);
                })

            })
 

   app.get('/blogs', (req, res)=>{
    blogCollection.find({})
    .toArray((err,items) => {
      res.send(items)
    })
   })
   app.delete('/blogDelete/:id', (req, res) => {
    blogCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
        .then(document => {
            res.redirect("/")
        })
})
})

   app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })