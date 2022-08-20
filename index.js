require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const { json } = require('body-parser');
const dns = require('node:dns');
const bodyParser = require('body-parser');
const app = express();

const db = require("./model/db.js");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());


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

// const isValidUrl = (original_url) => {
//   try { 
//     return Boolean(new URL(original_url)); 
//   }
//   catch(e){ 
//     return false; 
//   }
// }

let jsonParser = bodyParser.json()
let urlencodeParser = bodyParser.urlencoded({extended: false})



app.post('/api/shorturl', urlencodeParser, (req, res) => {
  let original_url = req.body.url

  const httpRegex = /^(http|https)(:\/\/)/;
  if (!httpRegex.test(original_url)) {return res.json({ error: 'invalid url' })}
  else {
  // check if URL is in valid format (https://www.example.com)
  // if(isValidUrl(original_url) === true) {
  //   console.log(1)
  //   // parse the URL and get the host 
    // let obj = new URL(original_url)
    // let host = JSON. stringify(obj)
    // dns.lookup(host, (err, address) => {
    // dns.lookup(original_url, (err, address, family) => {
      // console.log('address: %j family: IPv%s', address, family);
    //   console.log(err)
      var short_url  = "faith.ly-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
          
      let urlDetails = new db({
        url: original_url,
        short_url: short_url
      })

      try {
        urlDetails.save((err, data) => {
          if (err) return console.error(err);      
          res.json({ original_url : data.url, short_url: data.short_url})        
        })
      } catch (err) {
          console.log(err)
      }

    // });
  // } else {
  //   res.json({ error: "Invalid URL"})
  }

})



app.get('/api/shorturl/:shortUrl', jsonParser, (req, res) => {
  let shortUrl = req.params.shortUrl

  db.find({ short_url: shortUrl}, (err, data) => {
      if (err) res.send(err);
      res.redirect(data[0].url);
  });
})