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
var ObjectId = require('mongodb').ObjectId;
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

	var collection = client.db('UsersDB').collection('Students');

	if(playerData.input.includes("@")){

		await collection.findOne({"email": { $regex : new RegExp(playerData.input, "i")} },async (findError, result)=>{
			if(findError){
				console.log("findError")
			}

			//If E-mail is not in the "Students" Collection - Go search in the "Teachers" collection instead 
			if(!result){
				console.log("Student Not Found - Looking through 'Teachers' collection instead")

				collection = client.db('UsersDB').collection('Teachers');

				await collection.findOne({"email": { $regex : new RegExp(playerData.input, "i")}},async (findError, result)=>{
					if(findError){
						console.log("findError")
					}

					//If nothing was found
					if(!result){
						console.log("User not found")
						res.send("User not found")
					
					//E-mail found in the 'Teachers' collection - looking to see if password matches
					}else{
						console.log(result);
						if(result.password === playerData.password){
							res.send("Teacher logged in")
						}else{
							console.log("Wrong Password")
							res.send("User not found")
						}
					}
				})


			//E-mail found in the 'Students' collection - looking to see if password matches
			}else{
				console.log(result);
				if(result.password === playerData.password){
					//Password matches, Teacher logged in
					res.send("Student logged in")
				}else{
					//Password didnt match
					console.log("Wrong Password")
					res.send("User not found")
				}
			}
		})



	}else{


		await collection.findOne({"username": { $regex : new RegExp(playerData.input, "i")}},async (findError, result)=>{
			if(findError){
				console.log("findError")
			}

			//If Username is not in the "Students" Collection - Go search in the "Teachers" collection instead 
			if(!result){
				console.log("Student Not Found - Looking through 'Teachers' collection instead")

				collection = client.db('UsersDB').collection('Teachers');

				await collection.findOne({"username":{ $regex : new RegExp(playerData.input, "i")}},async (findError, result)=>{
					if(findError){
						console.log("findError")
					}

					//If nothing was found
					if(!result){
						console.log("User not found")
						res.send("User not found")
					
					//Username found in the 'Teachers' collection - looking to see if password matches
					}else{
						if(result.password === playerData.password){
							res.send("Teacher logged in")
						}else{
							console.log("Wrong Password")
							res.send("User not found")
						}
					}
				})
			//Username found in the 'Students' collection - looking to see if password matches
			}else{
				if(result.password === playerData.password){
					res.send("Student logged in")
				}else{
					console.log("Wrong Password")
					res.send("User not found")
				}
			}
		})


	}
	//{"username": { $regex : new RegExp(playerData.username, "i")}}
	//specifies the database within the cluster and collection within the database
	
	
	//Returns a single document, if one fits the conditions
	
});

router.post('/getuserinfo', async (req, res)=> {
	var playerData = req.body;
	console.log("GetUserInfo:" + playerData.input)

	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');


	if(playerData.input.includes("@")){

		await collection.findOne({"email": new RegExp(playerData.input, "i") }, async (findError, result) =>{
			
			if(findError) {
				console.log("MongoDB - Find: Error");
				console.log(findError);
			}

			if (!result) {
				console.log("StudentInfo not found");
				var collection = client.db('UsersDB').collection('Teachers');
				await collection.findOne({"email": new RegExp(playerData.input, "i") }, function (findError, result) {
		
					//Sends the player data back to Unity as a string
					if (!result) {
						console.log("Teacher not found");
						res.send("Info not found");
					}
					else {
						console.log("TeacherInfo Sent");
						res.send(`Teacher,${result._id},${result.email},${result.first_name},${result.last_name},${result.school}`);
					}
				})}
			else {
				console.log("StudentInfo Sent");
				res.send(`Student,${result._id},${result.email},${result.first_name},${result.last_name},${result.school},${result.username}`);
			}
		});
	}else{
		
		await collection.findOne({"username": new RegExp(playerData.input, "i") }, async (findError, result) =>{
			
			if(findError) {
				console.log("MongoDB - Find: Error");
				console.log(findError);
			}

			if (!result) {
				res.send("Info not found");
				}
			else {
				console.log("StudentInfo Sent");
				res.send(`Student,${result._id},${result.email},${result.first_name},${result.last_name},${result.school},${result.username}`);
			}
		});
	}


	//Returns a single document, if one fits the conditions
	
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
			res.send(`${result.exp.Mathematics},${result.exp.Danish},${result.exp.German},${result.exp.French},${result.exp.Geography},${result.exp.English},${result.exp.Physics}`);
		}
	});
});

router.post('/gethighscores', async (req, res) => {

	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');

	// var collCount;
	// await collection.count().then((count) => {
	// 	collCount = count;
	// });

	collection.find({}).toArray().then((result) => {
		if(!result){
			console.log("No result")
			res.send("Info not found")
		}else{
			
			var HighscoreString = ""

			//HighscoreJson += `"Count":"${collCount}":`
			for(var i = 0; i<result.length;i++){
				HighscoreString += `${result[i].username}:${result[i].exp.Mathematics}+${result[i].exp.Danish}+${result[i].exp.German}+${result[i].exp.French}+${result[i].exp.Geography}+${result[i].exp.English}+${result[i].exp.Physics},`
			}
			//HighscoreJson = HighscoreJson.substring(0, HighscoreJson.length - 1);
			var StringToSend = HighscoreString.substring(0, HighscoreString.length - 1);

			console.log(StringToSend);
			res.send(StringToSend);
		}		
	});
});

router.post('/getAllStudents', async (req, res) => {

	//specifies the database within the cluster and collection within the database
	var collection = client.db('UsersDB').collection('Students');

	collection.find({}).toArray().then((result) => {
		if(!result){
			console.log("No result")
			res.send("Info not found")
		}else{
			var studentsString = "";

			for(var i = 0; i<result.length;i++){
				studentsString += `${result[i]._id}+${result[i].username}+${result[i].email}+${result[i].first_name}+${result[i].last_name}+${result[i].class},`
			}
			var StringToSend = studentsString.substring(0, studentsString.length - 1);

			console.log(StringToSend);
			res.send(StringToSend);
		}		
	});
});



router.post('/signin_student', async (req, res) => {
	var collection = client.db('UsersDB').collection('Students');
		try{
			let studentData = req.body;
			console.log(studentData);

			var SubjectExp = {
				"Mathematics":0,
				"Danish":0,
				"German":0,
				"French":0,
				"Geography":0,
				"English":0,
				"Physics":0,
				}

			collection.findOne({"username": studentData.username}, async (findError, result) => {
				if(findError){
					console.log(findError);
				}
				else{
					//The username already exists
					if(result != null){
						console.log("Username already Exists");
						res.send("invalidUsername");
						
					}
					//the username does not exist -> possible new user
					else if(result == null){
						await collection.insertOne({
							"username": studentData.username, 
							"password": studentData.password, 
							"email": studentData.email, 
							"first_name": studentData.fname, 
							"last_name": studentData.lname, 
							"school": studentData.school, 
							"class": studentData.classNum, 
							"exp": SubjectExp,
							"completedHomework":[]
						});
						console.log("New student added!");
						res.send("success");
					}
				}
			});
		}
		catch(error){
			console.log(error);
		}
});

router.post('/signin_teacher', async (req, res) => {
	var collection = client.db('UsersDB').collection('Teachers');
	try{
		let teacherData = req.body;
		console.log(teacherData);

		collection.findOne({"email": teacherData.email}, async (findError, result) => {
			if(findError){
				console.log(findError);
			}
			else{
				if(result != null){
					console.log("User already Exists");
					res.send("invalidEmail");
				}
				else if(result == null){
					await collection.insertOne({
						"password": teacherData.password, 
						"email": teacherData.email, 
						"first_name": teacherData.fname, 
						"last_name": teacherData.lname, 
						"school": teacherData.school, 
						"class": teacherData.classNum});
					console.log("New Teacher added!");
					res.send("success");
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

		var ObjectToInsert = {
			"name": IslandData.name, 
			"subject": IslandData.subject, 
			"islandTemplate": IslandData.islandTemplate,
			"creator": IslandData.creator,
			"homework":[]
		}

		await collection.insertOne(ObjectToInsert);
		
		console.log(IslandData)
		res.send(ObjectToInsert._id);
	}
	catch(error){
		console.log(error);
		res.send("Error")
	}
});
router.post('/insertHomework', async (req, res) => {
	
	var collection = client.db('UsersDB').collection('Islands');

	let HomeworkData = req.body;
	console.log(HomeworkData);

		var ObjectToInsert = {
			"title": HomeworkData.title,
			"content": HomeworkData.content,
			"duedate": HomeworkData.duedate,
			"exp": HomeworkData.exp,
			"posX": HomeworkData.posX,
			"posY": HomeworkData.posY,
			"posZ": HomeworkData.posZ			
		}

       
		var id = new ObjectId(HomeworkData.islandId);
		
	try{
		await collection.updateOne(
			{"_id": id},
			{$push: {homework: ObjectToInsert}}
		)
	}
	catch(error){
		console.log(error);
		res.send("Error")
	}
});

router.post('/getIslands', async (req, res) => {
	
	var collection = client.db('UsersDB').collection('Islands');

	let IslandData = req.body;
	//console.log(IslandData);

	collection.find({"subject":IslandData.subject}).toArray().then((result) => {
		if(!result){
			console.log("No result")
			res.send("Info not found")
		}else{
			
			var islandsString = "";
			
			for(var i = 0; i<result.length;i++){
				islandsString += `${result[i]._id}+${result[i].name}+${result[i].subject}+${result[i].islandTemplate}+${result[i].creator}:`;
				for(var j = 0; j < result[i].homework.length; j++){
					var tempHomework = result[i].homework[j];
					islandsString += tempHomework.title + '+' + tempHomework.content + '+' + tempHomework.duedate + '+' + tempHomework.exp + '+' + tempHomework.posX + '+' + tempHomework.posY + '+' + tempHomework.posZ + "!";
					}
				islandsString = islandsString.substring(0, islandsString.length - 1);
				islandsString += ',';
			}
			islandsString = islandsString.substring(0, islandsString.length - 1);
			res.send(islandsString);
		}		
	});
});

router.post('/HomeworkDone', async (req, res) => {
	
	let HomeworkDoneData = req.body;
	//console.log(HomeworkDoneData);

	//1. Add to students CompletedList
	//2. Add to Student Exp

	var collection = client.db('UsersDB').collection('Students');

	  
	var id = new ObjectId(HomeworkDoneData.studentId);
	var subjectExp = "exp." + HomeworkDoneData.subject;
	var exp = parseInt(HomeworkDoneData.exp)

	var CompletedHomework = {
		"islandId": HomeworkDoneData.islandId,
		"posX": HomeworkDoneData.posX,
		"posY": HomeworkDoneData.posY,
		"posZ": HomeworkDoneData.posZ			
	}
	try{
		await collection.updateOne(
			{"_id": id},
			{$push: {completedHomework: CompletedHomework}, $inc: {[subjectExp]: exp}}
		)
		res.send("Sucess");
	}catch(error){
		console.log(error);
		res.send("Error")
	}
});

router.post('/GetCompletedHomework', async (req, res) => {
	
	let reqData = req.body;
	//console.log(reqData);

	//1. Responds with a list of completed homework

	var collection = client.db('UsersDB').collection('Students');  
	var id = new ObjectId(reqData.studentId);
	if(id != null){
		await collection.findOne({"_id": id}, async (findError, result) => {
			var completeHomework = ""
			for(var i = 0; i < result.completedHomework.length; i++){
				completeHomework += `${result.completedHomework[i].islandId},${result.completedHomework[i].posX},${result.completedHomework[i].posY},${result.completedHomework[i].posZ}:`
			}
			completeHomework = completeHomework.substring(0, completeHomework.length - 1);
			res.send(completeHomework)
		});
	}
	else{
		await collection.find({}).toArray().then((result) => {
			var completeHomework = ""
			for(var i = 0; i < result.completedHomework.length; i++){
				completeHomework += `${result.completedHomework[i].islandId},${result.completedHomework[i].posX},${result.completedHomework[i].posY},${result.completedHomework[i].posZ}:`
			}
			completeHomework = completeHomework.substring(0, completeHomework.length - 1);
			res.send(completeHomework)
		});
	}
	
});

module.exports = router;
