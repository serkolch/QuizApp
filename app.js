var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')
var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var MongoStore = require('connect-mongo')(session)

var authenticateUser = function(email, password, callback) {
  db.collection('users').findOne({email: email}, function(err, data) {
    if (err) {throw err;}
    if (data) {
      bcrypt.compare(password, data.password_digest, function(err, passwordsMatch) {
        if (passwordsMatch) {
          callback(data);
        } else {
          callback(false);
        }
      })
    } else {
      callback(false);
    }
  });
};

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/semantic'));
app.set('view engine', 'ejs')

// db
var db;
// var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sandbox';
var mongoUrl = 'mongodb://localhost:27017/quizApp';
MongoClient.connect(mongoUrl, function(err, database) {
  if (err) { throw err; }
  db = database;
  // var hash = bcrypt.hashSync('sample1', 8)
  // db.collection('users').insert({email: 'student@sample.com', password_digest: hash, type:'student'})
  process.on('exit', db.close);
});

app.use(session({
  secret: 'waffles',
  store: new MongoStore({ url: mongoUrl })
}));

app.get('/',function(req,res){
  res.render('landing');
});

app.post('/login', function(req, res) {
  authenticateUser(req.body.email, req.body.password, function(user) {
    if (user) {
      req.session.email = user.email;
      req.session.userId = user._id;
      req.session.type = user.type;
      res.redirect('/dash')
    } else {
      res.redirect('/');
    }
  });
});

app.get('/dash',function(req,res){
  if (req.session.type === 'instructor'){
    res.render('instructors/dash',{user:req.session.email})
  } else if (req.session.type === 'student') {
    res.render('students/dash',{user:req.session.email})
  } else {
    res.redirect('/')
  }
})

app.get('/logout',function(req,res){
  req.session.name = null;
  req.session.userId = null;
  req.session.type = null;
  res.redirect('/');
})

app.listen(process.env.PORT || 3000);