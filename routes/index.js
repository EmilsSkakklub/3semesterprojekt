var express = require('express'), 
	bodyParser = require("body-parser");
var router = express.Router();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

var client;
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb+srv://admin:admin@motedu.fbj4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", function (connectionError, dbclient) {

	//Check for Errors
	if (!connectionError) {
		console.log("MongoDB - Connection: Established");
	}
	else {
		console.log("MongoDB - Connection: Error");
		console.log(connectionError);
	}

	client = dbclient;
});


/*============= GETS ============= */
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

router.get('/signin_student', function(req, res, next) {
	res.render('signin_student', { title: 'Sign-in - motedu.' });
  });


//============= POSTS =============
router.post('/login', function (req, res) {
	var playerData = req.body;
	//Extracts the field values from the request
	console.log("HTTP Post Request: /login?username=" + playerData.username + "&password=" + playerData.password);

	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');

	//Returns a single document, if one fits the conditions
	collection.findOne({"username": playerData.username, "password": playerData.password }, function (findError, result) {
		//Check for Errors
		if (!findError) {
			console.log("MongoDB - Find: No Errors");
		}
		else {
			console.log("MongoDB - Find: Error");
			console.log(findError);
		}

		//Sends the player data back to Unity as a string
		if (!result) {
			console.log("Student not found");
			var collection = client.db('UsersDB').collection('Teachers');
			collection.findOne({"username": playerData.username, "password": playerData.password }, function (findError, result) {
	
				//Sends the player data back to Unity as a string
				if (!result) {
					console.log("Teacher not found");
					res.send("Player not found");
				}
				else {
					console.log("Teacher logged in");
					res.send("Player logged in");
				}
			})}
		else {
			console.log("Student logged in");
			res.send("Player logged in");
		}
	});
});

router.post('/getuserinfo', function (req, res) {
	var playerData = req.body;
	//Extracts the field values from the request
	console.log("HTTP Post Request: /getuserinfo?username=" + playerData.username);

	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');

	//Returns a single document, if one fits the conditions
	collection.findOne({"username": playerData.username}, function (findError, result) {
		//Check for Errors
		if (!findError) {
			console.log("MongoDB - Find: No Errors");
		}
		else {
			console.log("MongoDB - Find: Error");
			console.log(findError);
		}

		//Sends the player data back to Unity as a string
		if (!result) {
			console.log("StudentInfo not found");
			var collection = client.db('UsersDB').collection('Teachers');
			collection.findOne({"username": playerData.username}, function (findError, result) {
	
				//Sends the player data back to Unity as a string
				if (!result) {
					console.log("Teacher not found");
					res.send("Info not found");
				}
				else {
					console.log("TeacherInfo Sent");
					res.send(`{"email":"${result.email}","fname":"${result.first_name}","lname":"${result.last_name}", "school":"${result.school}"}`);
				}
			})}
		else {
			console.log("StudentInfo Sent");
			res.send(`{"email":"${result.email}","fname":"${result.first_name}","lname":"${result.last_name}", "school":"${result.school}"}`);
		}
	});
});

module.exports = router;
