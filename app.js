var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/semantic'));
app.set('view engine', 'ejs')

// db
var db;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
// var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sandbox';
var mongoUrl = 'mongodb://localhost:27017/quizApp';
MongoClient.connect(mongoUrl, function(err, database) {
  if (err) { throw err; }
  db = database;
  process.on('exit', db.close);
});

app.get('/',function(req,res){
  res.render('landing');
});

app.post('/login',function(req,res){
  console.log(req.body);
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);