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

router.get('/signin_teacher', function(req, res, next) {
	res.render('signin_teacher', { title: 'Sign-in Teacher - motedu.' });
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
			res.send(`{"email":"${result.email}","fname":"${result.first_name}","lname":"${result.last_name}", "school":"${result.school}", "exp":"${result.exp}"}`);
		}
	});
});

router.post('/getexp', function (req, res) {
	var playerData = req.body;
	//Extracts the field values from the request
	console.log("HTTP Post Request: /getexp?username=" + playerData.username);

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
			}
		else {
			console.log("StudentInfo Sent");
			res.send(`${result.exp}`);
		}
	});
});

router.post('/gethighscores', async (req, res) => {

	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');

	var collCount;
	await collection.count().then((count) => {
		collCount = count;
	});

	collection.find({ "exp": { $gte: 0 } }).toArray().then((result) => {
		if(!result){
			console.log("No result")
			res.send("Info not found")
		}else{
			
			var HighscoreJson = ""

			HighscoreJson += "{"
			HighscoreJson += `"Count":"${collCount}",`
			for(var i = 0; i<result.length;i++){
				HighscoreJson += `"${result[i].username}":"${result[i].exp}",`
			}
			//HighscoreJson = HighscoreJson.substring(0, HighscoreJson.length - 1);
			HighscoreJson += "}"

			console.log(HighscoreJson);
			res.send(HighscoreJson);
		}		
	});
});



router.post('/signin_student', async (req, res) => {

	//console.log(req.body);

	var collection = client.db('UsersDB').collection('Students');
		try{
			let studentData = req.body;
			console.log(studentData);

			collection.findOne({"username": studentData.username}, async (findError, result) => {
				if(findError){
					console.log(findError);
				}
				else{
					if(result != null){
						console.log("Username already Exists");
						res.send("InvalidUsername");
					}
					else if(result == null){
						if(studentData.password == studentData.rePassword){
							await collection.insertOne({"username": studentData.username, "password": studentData.password, "email": studentData.email, "first_name": studentData.fname, "last_name": studentData.lname, "school": studentData.school, "exp": 0});
							console.log("New student added!");
							res.send("YouDidIt");
						}
						else{
							console.log("Please enter in the same password.");
							res.send("WrongPassword");
						}
					}
				}
			});
		}
		catch(error){
			console.log(error);
		}
});

router.post('/signin_teacher', async (req, res) => {
	console.log(req.body);

	var collection = client.db('UsersDB').collection('Teachers');
	try{
		let teacherData = req.body;
		console.log(teacherData);

		collection.findOne({"username": teacherData.username}, async (findError, result) => {
			if(findError){
				console.log(findError);
			}
			else{
				if(result != null){
					console.log("Username already Exists");
					res.send("InvalidUsername");
				}
				else if(result == null){
					if(teacherData.password == teacherData.rePassword){
						await collection.insertOne({"password": teacherData.password, "email": teacherData.email, "first_name": teacherData.fname, "last_name": teacherData.lname, "school": teacherData.school, "exp": 0});
						console.log("New Teacher added!");
						res.send("YouDidIt");
					}
					else{
						console.log("Please enter in the same password.");
						res.send("WrongPassword");
					}
				}
			}
		})
	}
	catch(error){
		console.log(error);
	}
});


module.exports = router;
