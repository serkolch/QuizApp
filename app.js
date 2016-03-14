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
  var data = {cohorts:[],students:[],quizzes:[]};
  var cohortIds
  var students
  var quizzes

  var doRender = function(){
    if (data.students.length===students.length && data.cohorts.length===cohortIds.length){
      res.render('instructors/dash',{user:req.session.email, cohorts: data.cohorts,students: data.students})
    }
  }

  if (req.session.type === 'instructor'){
    db.collection('users').findOne({_id:ObjectId(req.session.userId)},function(err,result){
      cohortIds = result.cohorts;
      cohortIds.forEach(function(cohortId){
        db.collection('cohorts').findOne({_id: ObjectId(cohortId)},function(err,result){
          if (data.cohorts.length===0){
            students = result.students
            quizzes = result.quizzes
            students.forEach(function(student){
              db.collection('users').findOne({_id: ObjectId(student)},function(err,result){
                data.students.push({id:student,email:result.email})
                doRender();
              })
            })
          }
          data.cohorts.push(result.name)
          doRender();
        })
      })
    })
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

app.get('/instructor/ajax',function(req,res){
  var data = {}
  var cohortIds
  var cohortNames = []
  var students = {}

  var doRender = function(){
    var boolean = true
    for (var i=0;i<cohortNames.length;i++){
      var cohortName = cohortNames[i];
      if (data[cohortName].students.length!== students[cohortName].length){
        boolean = false
      }
    }
    if (boolean){
      console.log(boolean)
      res.json(data)
    }
  }

  var doStudents = function(){
    if (cohortIds.length===Object.keys(students).length){
      Object.keys(students).forEach(function(cohort){
        data[cohort] = {students:[],quizzes:[]}
        students[cohort].forEach(function(student){
          db.collection('users').findOne({_id:ObjectId(student)},function(err,result){
            // console.log(data[cohort].students)
            data[cohort].students.push({id: result._id,email: result.email})
            doRender();
          })
        })
      })
    }
  }

  db.collection('users').findOne({_id: ObjectId(req.session.userId)},function(err,result){
    cohortIds = result.cohorts
    cohortIds.forEach(function(cohortId){
      db.collection('cohorts').findOne({_id: ObjectId(cohortId)},function(err,result){
        cohortNames.push(result.name)
        students[result.name] = result.students
        doStudents()
      })
    })
  })

})

app.get('/quizzes',function(req,res){
  res.render('quizzes/index')
})

app.get('/quiz',function(req,res){
  res.render('quizzes/index')
})

app.get('/quizzes/:id',function(req,res){
  res.render('quizzes/index')
})

app.get('/quizzes/new',function(req,res){
  res.render('quizzes/index')
})


app.listen(process.env.PORT || 3000);