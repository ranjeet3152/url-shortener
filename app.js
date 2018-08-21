// require and instantiate express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var Url = require('./models/url');
var base58 = require('./base58.js');
var path = require('path');
var RateLimit = require('express-rate-limit');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var apiLimiter = new RateLimit({
  windowMs: 60*1000,
  max: 10,
  delayMs: 0
});

app.use('/api/shorten', apiLimiter);

app.get('/', function(req, res){
   res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url;
  var shortUrl = '';
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);
      res.send({'shortUrl': shortUrl});
    } else {
      var newUrl = Url({
        long_url: longUrl
      });
      newUrl.save(function(err) {
        if (err){
          console.log(err);
				}
        shortUrl = config.webhost + base58.encode(newUrl._id);
        res.send({'shortUrl': shortUrl});
      });
    }
  });
});

app.get('/:encoded_id', function(req, res){
  var base58Id = req.params.encoded_id;
  var id = base58.decode(base58Id);
  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
			if (doc) {
      res.redirect(doc.long_url);
			} else {
      res.redirect(config.webhost);
    }
  });

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
