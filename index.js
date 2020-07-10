const express = require('express');
const helmet = require('helmet')
const app = express();

app.use(helmet()) // Basic express protection
app.listen(3000) // Listen to port

app.get('/', function(req, res) { res.sendStatus(200) })

app.get('/lyrics/:music', function(req, res) { // http://adress.com/lyrics/Faded?apikey=apikey
  if(!req.query.apikey) return res.send('No apikey specified, authorization declined.');
  if(!req.params.music) return res.send('No music specified!');
  const apikey = process.env.APIKEY;
  if(req.query.apikey !== process.env.APIKEY) return res.send('Invalid apikey providen.');
  if(req.query.apikey && req.params.music && req.query.apikey === process.env.APIKEY) {
    const Genius = new (require("genius-lyrics")).Client(process.env.GENIUSAPIKEY);
    try {
Genius.tracks.search(req.params.music, { limit: 1 }).catch(err => { if(err) return res.send(err) }) // Searches for music, if err exists return send err.
.then(results => {
    const song = results[0];
    song.lyrics()
    .then(async lyrics => {
      res.send(lyrics)
    })
})
    } catch(e) {
      res.send(e)
    }
  }
})