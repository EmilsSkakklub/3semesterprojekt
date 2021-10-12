var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'motedu.' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about - motedu.' });
});

router.get('/teachers', function(req, res, next) {
  res.render('teachers', { title: 'teachers - motedu.' });
});

router.get('/parents', function(req, res, next) {
  res.render('parents', { title: 'parents - motedu.' });
});

router.get('/student_login', function(req, res, next) {
  res.render('login_student', { title: 'log-in - motedu.' });
});

router.get('/teacher_login', function(req, res, next) {
  res.render('login_teacher', { title: 'log-in - motedu.' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'game - motedu.' });
});


module.exports = router;
