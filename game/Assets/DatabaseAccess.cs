using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class DatabaseAccess : MonoBehaviour
{
    MongoClient client = new MongoClient("mongodb+srv://ploug:Scs67sbb2509@motedu.fbj4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    IMongoDatabase database;
    IMongoCollection<BsonDocument> collection;
  
    void Start()
    {
        database = client.GetDatabase("UsersDB");
        collection = database.GetCollection<BsonDocument>("UsersCollection");



        //SaveStudentToDataBase("Limeremir", "kode123", "emrim19@student.sdu.dk", "Emil", "Rimer","SDU - Odense");
        //SaveStudentToDataBase("Anthonio", "kode123", "antpe20@student.sdu.dk", "Anthon", "Kristian Skov Petersen", "SDU - Odense");
        //SaveStudentToDataBase("Carooo", "kode123", "carol19@student.sdu.dk", "Caroline", "Sofie Bue Hansen", "SDU - Odense");




    }

    public async void SaveStudentToDataBase(string username, string password, string email, string fname, string lname, string school)
    {
        var document = new BsonDocument { { "username", username}, { "password", password }, { "email", email}, { "first_name", fname}, { "last_name", lname}, { "school", school}, };
        await collection.InsertOneAsync(document);
    }
    
    public async Task<List<Student>> GetStudentsFromDataBase()
    {
        var allScoresTask = collection.FindAsync(new BsonDocument());
        var studentsAwaited = await allScoresTask;

        List<Student> students = new List<Student>();
        foreach (var student in studentsAwaited.ToList())
        {
            students.Add(Deserialize(student.ToString()));
        }
        return students;
    }
    // rawJson:
    // "{ \"_id\" : ObjectId(\"616edff546810a5e8c9e4af5\"),\"username\":\"Plougz123\",\"password\":\"kode123\",\"email\":\"rasmusploug@live.dk\",\"first_name\":\"Rasmus\",\"last_name\":\"Ploug\",\"school\":\"SDU - Odense\"}"
    private Student Deserialize(string rawJson)
    {
        var student = new Student();

        var stringWithoutID = rawJson.Substring(rawJson.IndexOf("),") + 4);
        var username = stringWithoutID.Substring(stringWithoutID.IndexOf("username") + 13, stringWithoutID.IndexOf("password")-4 - (stringWithoutID.IndexOf("username") + 13));
        var password = stringWithoutID.Substring(stringWithoutID.IndexOf("password") + 13, stringWithoutID.IndexOf("email") - 4 - (stringWithoutID.IndexOf("password") + 13));
        var email = stringWithoutID.Substring(stringWithoutID.IndexOf("email") + 10, stringWithoutID.IndexOf("first_name") - 4 - (stringWithoutID.IndexOf("email") + 10));
        var fname = stringWithoutID.Substring(stringWithoutID.IndexOf("first_name") + 15, stringWithoutID.IndexOf("last_name") - 4 - (stringWithoutID.IndexOf("first_name") + 15));
        var lname = stringWithoutID.Substring(stringWithoutID.IndexOf("last_name") + 14, stringWithoutID.IndexOf("school") - 4 - (stringWithoutID.IndexOf("last_name") + 14));
        var school = stringWithoutID.Substring(stringWithoutID.IndexOf("school") + 11, stringWithoutID.IndexOf("}")-2 - (stringWithoutID.IndexOf("school") + 11));

        student.username = username;
        student.password = password;
        student.email = email;
        student.fname = fname;
        student.lname = lname;
        student.school = school;


        return student;
    }
}


//inline class

public class Student
{
    //public async void SaveStudentToDataBase(string username, string password, string email, string fname, string lname, string school)
    public string fname { get; set; }
    public string lname { get; set; }
    public string username { get; set; }
    public string password { get; set; }
    public string email { get; set; }
    public string school { get; set; }

}