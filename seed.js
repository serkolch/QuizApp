var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;

// db
var db;
// var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sandbox';
var mongoUrl = 'mongodb://localhost:27017/quizApp';
MongoClient.connect(mongoUrl, function(err, database) {
  if (err) { throw err; }
  db = database;
  var hash = bcrypt.hashSync('sample1', 8)
  db.collection('users').remove();
  db.collection('users').insert({email: 'student@sample.com', password_digest: hash, type:'student'});
  db.collection('users').insert({email: 'instructor@sample.com', password_digest: hash, type:'instructor'});
  process.on('exit', db.close);
});