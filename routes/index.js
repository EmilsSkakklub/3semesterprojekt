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

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'game - motedu.' });
});

router.get('/signin', function(req, res, next) {
	res.render('signin', { title: 'Sign-in - motedu.' });
});

router.get('/signin_student', function(req, res, next) {
	res.render('signin_student', { title: 'Sign-in Student - motedu.' });
});

router.get('/signin_teacher', function(req, res, next) {
	res.render('signin_teacher', { title: 'Sign-in Teacher - motedu.' });
});


//============= POSTS =============
router.post('/login', async (req, res) => {
	var playerData = req.body;

	console.log(new RegExp(playerData.username, "i"));
	console.log(new RegExp(playerData.email, "i"));

	//Extracts the field values from the 
	if(playerData.username != undefined){
		console.log("HTTP Post Request: /login?username=" + playerData.username + "&password=" + playerData.password);
	}else{
		console.log("HTTP Post Request: /login?email=" + playerData.email + "&password=" + playerData.password);
	}
	
	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');
	
	//Returns a single document, if one fits the conditions
	await collection.findOne(		
				{"username": { $regex : new RegExp(playerData.username, "i")}},
				{"email":  { $regex : new RegExp(playerData.email, "i")}}						
		, async (findError, result) => {

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
			await collection.findOne(
				{"email": new RegExp(playerData.email, "i")}, function (findError, result) {
	
				//Sends the player data back to Unity as a string
				if (!result) {
					console.log("Teacher not found");
					res.send("Player not found");
				}
				else {
					if(result.password == playerData.password){
						console.log("Teacher logged in");
						res.send("Teacher logged in");
					}else{
						console.log("t_Password Incorrect");
						res.send("Player not found");
					}
				}
			})}
		else {

			if(result.password == playerData.password){
				console.log("Student logged in");
				res.send("Student logged in");
			}else{
				console.log("Password Incorrect");		
				console.log("Student not found");
				var collection = client.db('UsersDB').collection('Teachers');
				await collection.findOne(
					{"email": new RegExp(playerData.email, "i")}, function (findError, result) {
	
					//Sends the player data back to Unity as a string
					if (!result) {
						console.log("Teacher not found");
						res.send("Player not found");
					}
					else {
						if(result.password == playerData.password){
							console.log("Teacher logged in");
							res.send("Teacher logged in");
						}else{
							console.log("t_Password Incorrect");
							res.send("Player not found");
					}
					}
				})
			}			
		}
	});
});

router.post('/getuserinfo', async (req, res)=> {
	var playerData = req.body;
	console.log("GetUserInfo:" + playerData.username)
	//Extracts the field values from the request
	console.log("G Post Request: /getuserinfo?username=" + playerData.username);

	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');

	//Returns a single document, if one fits the conditions
	await collection.findOne({
		"username": new RegExp(playerData.username, "i"),
		"email": new RegExp(playerData.email, "i") }, 
		async (findError, result) =>{
		//Check for Errors
		if (!findError) {
			console.log("MongoDB - Find: No Errors");
		}else {
			console.log("MongoDB - Find: Error");
			console.log(findError);
		}
		if (!result) {
			console.log("StudentInfo not found");
			var collection = client.db('UsersDB').collection('Teachers');
			await collection.findOne({"email": new RegExp(playerData.email, "i") }, function (findError, result) {
	
				//Sends the player data back to Unity as a string
				if (!result) {
					console.log("Teacher not found");
					res.send("Info not found");
				}
				else {
					console.log("TeacherInfo Sent");
					res.send(`{"id":"${result._id}","email":"${result.email}","fname":"${result.first_name}","lname":"${result.last_name}", "school":"${result.school}"}`);
				}
			})}
		else {
			console.log("StudentInfo Sent");
			res.send(`{"id":"${result._id}","email":"${result.email}","fname":"${result.first_name}","lname":"${result.last_name}", "school":"${result.school}", "exp":"${result.exp}", "username":"${result.username}"}`);
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
						alert("Hello!");
						
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

router.post('/createIsland', async (req, res) => {
	
	var collection = client.db('UsersDB').collection('Islands');
	try{
		let IslandData = req.body;
		
		await collection.insertOne({
			"name": IslandData.name, 
			"subject": IslandData.subject, 
			"islandTemplate": IslandData.islandTemplate,
			"creator": IslandData.creator
		});
		console.log("IslandAdded: "+ IslandData)
		res.send("IslandAdded")
	}
	catch(error){
		console.log(error);
		res.send("Error")
	}
});


module.exports = router;
