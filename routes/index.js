var express = require('express');
var prompt = require('prompt');

var router = express.Router();
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'akhil',
  password : 'akhil@123',
  database : 'fashionevent'
});

connection.connect(function(err) {
 if (err) {
   console.error('error connecting: ' + err.stack);
   return;
 }

 console.log('connected as id ' + connection.threadId);
});


// GET home page
router.get('/', function(req, res, next) {
    res.render('index');

});

router.get('/contactus', function(req, res, next) {
    res.render('contactus');

});

router.get('/judges', function(req, res, next) {

  connection.query("SELECT jname,age FROM "+"judges"+";", function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    res.render('judges', { title: 'Judges', data : results });
  });
});

router.get('/event', function(req, res, next) {
  connection.query("SELECT ename,city,date FROM "+"event"+";", function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    res.render('event', { title: 'Event', data : results });
  });
});

router.get('/sponsor', function(req, res, next) {
  connection.query("SELECT sname,city,samount FROM sponsers s,event e ,sponserevent se WHERE s.sid = se.sid and se.eid = e.eid ORDER BY samount DESC;", function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results);
      res.render('sponsor', { title: 'Main Sponsor', data : results });
    });
});

router.get('/', function(req, res, next) {
  connection.query("select count(*) as no_participant from participants;", function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results);
      res.render('index', { title: 'no_participant', data : results });
    });
});

router.get('/addparticipant', function(req, res, next){
  res.render('addparticipant');
});

router.post('/addparticipant', function(req, res, next) {
  console.log(req.body);
  connection.query("SELECT max(pid) as pid from participants;",function (error,results,fields){
    if (error) throw error;
    console.log("Res ", results);
    console.log(results[0].pid);
    var newPid = Number(results[0].pid)+1;
    console.log(newPid);
    connection.query({
        sql : "insert into participants values(?, ?, ?, ?)" ,
        values : [newPid, req.body.ename, req.body.age, req.body.height]
    },
     function (error, results, fields) {
        if (error){
          console.log(error);
        }
          res.render('register');

      });

  });

  router.get('/register', function(req, res, next){
    res.render('register');
  });

});


module.exports = router;
