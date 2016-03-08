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
  db.collection('cohorts').remove();

  db.collection('users').insert([
    {email: 'student1@sample.com', password_digest: hash,type:'student'},
    {email: 'student2@sample.com', password_digest: hash,type:'student'},
    {email: 'student3@sample.com', password_digest: hash,type:'student'},
    {email: 'student4@sample.com', password_digest: hash,type:'student'},
    {email: 'student5@sample.com', password_digest: hash,type:'student'},
    {email: 'student6@sample.com', password_digest: hash,type:'student'},
    {email: 'student7@sample.com', password_digest: hash,type:'student'},
    {email: 'student8@sample.com', password_digest: hash,type:'student'},
    {email: 'student9@sample.com', password_digest: hash,type:'student'},
    {email: 'student10@sample.com', password_digest: hash,type:'student'},
    {email: 'student11@sample.com', password_digest: hash,type:'student'},
    {email: 'student12@sample.com', password_digest: hash,type:'student'}        
  ]);
  db.collection('users').insert({email: 'instructor@sample.com', password_digest: hash,type:'instructor',cohorts:[]});
  db.collection('cohorts').insert([
    {name:'Sample1',students:[],quizzes:[]},
    {name:'Sample2',students:[],quizzes:[]},
    {name:'Sample3',students:[],quizzes:[]}
  ]);
  db.collection('cohorts').find().toArray(function(err,results){
    results.forEach(function(result){
      db.collection('users').update({email: 'instructor@sample.com'},{$push: {cohorts: result._id}})
    })
  })
  db.collection('users').find({type:'student'}).toArray(function(err,results){
    results.forEach(function(result,index){
      db.collection('cohorts').update({name: 'Sample1'},{$push: {students: result._id}})
      if (index%2===1){
        db.collection('cohorts').update({name: 'Sample2'},{$push: {students: result._id}})
      } else {
        db.collection('cohorts').update({name: 'Sample3'},{$push: {students: result._id}})      
      }
    })
  })  
  process.on('exit', db.close);
});