var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});
router.get('/student_login', function(req, res, next) {
  res.render('login_student', { title: 'Express' });
});

module.exports = router;
