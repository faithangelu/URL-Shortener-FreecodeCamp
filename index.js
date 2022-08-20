require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const { json } = require('body-parser');
const dns = require('node:dns');
const bodyParser = require('body-parser');
const { doesNotMatch } = require('node:assert');
const app = express();
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true }
).then(() => console.log("Database connected!"))
 .catch(err => console.log(err));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const isValidUrl = (original_url) => {
  try { 
    return Boolean(new URL(original_url)); 
  }
  catch(e){ 
    return false; 
  }
}

let jsonParser = bodyParser.json()
let urlencodeParser = bodyParser.urlencoded({extended: false})


const urlSchema = new mongoose.Schema({
  url: String, 
  short_url: String  
})

// create Model
const UrlDB = mongoose.model('Url', urlSchema);

app.post('/api/shorturl', urlencodeParser, (req, res) => {
  let original_url = req.body.url

  // check if URL is in valid format (https://www.example.com)
  if(isValidUrl(original_url) === true) {
    
    // parse the URL and get the host 
    let obj = new URL(original_url)
    let host = JSON. stringify(obj)
    dns.lookup(host, (err, address) => {
     
      var short_url  = "faith.ly-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      var urlDetails = new UrlDB({
        url: original_url,
        short_url: short_url
      })

      urlDetails.save((err, data) => {
        if (err) return console.error(err);      
        res.json({ original_url : data.url, short_url: data.short_url})        
      })

    });
  } else {
    res.json({ error: "Invalid URL"})
  }
})



app.get('/api/shorturl/:shortUrl', jsonParser, (req, res) => {
  let sURL = req.params.shortUrl
  
  UrlDB.find({ short_url: sURL}, (err, data) => {
    if (err) res.send(err);
    res.redirect(data[0].url);
  });

})