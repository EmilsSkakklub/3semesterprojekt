using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class DatabaseAccess : MonoBehaviour
{
    MongoClient client = new MongoClient("mongodb+srv://admin:admin@motedu.fbj4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    IMongoDatabase user_db;
    IMongoCollection<BsonDocument> studentsCol;
    IMongoCollection<BsonDocument> teachersCol;

    void Start()
    {
        user_db = client.GetDatabase("UsersDB");
        studentsCol = user_db.GetCollection<BsonDocument>("Students");
        teachersCol = user_db.GetCollection<BsonDocument>("Teachers");


        //SaveStudentToDataBase("Plougz", "kode123", "raplo20@student.sdu.dk", "Rasmus", "Ploug","SDU - Odense");
        //SaveStudentToDataBase("Limeremir", "kode123", "emrim19@student.sdu.dk", "Emil", "Rimer","SDU - Odense");
        //SaveStudentToDataBase("Anthonio", "kode123", "antpe20@student.sdu.dk", "Anthon", "Kristian Skov Petersen", "SDU - Odense");
        //SaveStudentToDataBase("Carooo", "kode123", "carol19@student.sdu.dk", "Caroline", "Sofie Bue Hansen", "SDU - Odense");

        //SaveTeacherToDataBase("Lassere", "kode123", "lasse@teacher.sdu.dk", "Lasse", "manden", "SDU - Odense");
        Debug.Log(GetTeacher("Lassere").id);
    }

    public async void SaveStudentToDataBase(string username, string password, string email, string fname, string lname, string school)
    {
        var document = new BsonDocument { { "username", username}, { "password", password }, { "email", email}, { "first_name", fname}, { "last_name", lname}, { "school", school}, };
        await studentsCol.InsertOneAsync(document);
    }
    public async void SaveTeacherToDataBase(string username, string password, string email, string fname, string lname, string school)
    {
        var document = new BsonDocument { { "username", username }, { "password", password }, { "email", email }, { "first_name", fname }, { "last_name", lname }, { "school", school }, };
        await teachersCol.InsertOneAsync(document);
    }

    public async Task<List<Student>> GetStudentsFromDataBase()
    {
        var allStudentsTask = studentsCol.FindAsync(new BsonDocument());
        var studentsAwaited = await allStudentsTask;

        List<Student> students = new List<Student>();
        foreach (var student in studentsAwaited.ToList())
        {
            students.Add(S_Deserialize(student.ToString()));
        }

        return students;
    }
    public async Task<List<Teacher>> GetTeachersFromDataBase()
    {
        var allStudentsTask = teachersCol.FindAsync(new BsonDocument());
        var studentsAwaited = await allStudentsTask;

        List<Teacher> teachers = new List<Teacher>();
        foreach (var teacher in studentsAwaited.ToList())
        {
            teachers.Add(T_Deserialize(teacher.ToString()));
        }

        return teachers;
    }

    public Student GetStudent(string username)
    {
        Student targetStudent = new Student();
        var result = Task.Run(() => GetStudentsFromDataBase()).Result;

        foreach (var student in result)
        {
            if(student.username.ToLower() == username.ToLower())
            {
                targetStudent = student;
                break;
            }
        }
        return targetStudent;
    }
    public Teacher GetTeacher(string username)
    {
        Teacher targetStudent = new Teacher();
        var result = Task.Run(() => GetTeachersFromDataBase()).Result;

        foreach (var teacher in result)
        {
            if (teacher.username.ToLower() == username.ToLower())
            {
                targetStudent = teacher;
                break;
            }
        }
        return targetStudent;
    }
    public void UpdateUser(bool student, string id, string valueToUpdate, string newValue) //CaseSensitive
    {
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
        var update = Builders<BsonDocument>.Update.Set(valueToUpdate, newValue);

        if (student)
        {
            studentsCol.UpdateOne(filter, update);
        }
        else
        {
            teachersCol.UpdateOne(filter, update);
        }
        
    }
    // rawJson:
    // "{ \"_id\" : ObjectId(\"616edff546810a5e8c9e4af5\"),\"username\":\"Plougz123\",\"password\":\"kode123\",\"email\":\"rasmusploug@live.dk\",\"first_name\":\"Rasmus\",\"last_name\":\"Ploug\",\"school\":\"SDU - Odense\"}"
    private Student S_Deserialize(string rawJson)
    {
        var student = new Student();

        var id = rawJson.Substring(rawJson.IndexOf("ObjectId")+10, 24);
        var stringWithoutID = rawJson.Substring(rawJson.IndexOf("),") + 4);
        var username = stringWithoutID.Substring(stringWithoutID.IndexOf("username") + 13, stringWithoutID.IndexOf("password")-4 - (stringWithoutID.IndexOf("username") + 13));
        var password = stringWithoutID.Substring(stringWithoutID.IndexOf("password") + 13, stringWithoutID.IndexOf("email") - 4 - (stringWithoutID.IndexOf("password") + 13));
        var email = stringWithoutID.Substring(stringWithoutID.IndexOf("email") + 10, stringWithoutID.IndexOf("first_name") - 4 - (stringWithoutID.IndexOf("email") + 10));
        var fname = stringWithoutID.Substring(stringWithoutID.IndexOf("first_name") + 15, stringWithoutID.IndexOf("last_name") - 4 - (stringWithoutID.IndexOf("first_name") + 15));
        var lname = stringWithoutID.Substring(stringWithoutID.IndexOf("last_name") + 14, stringWithoutID.IndexOf("school") - 4 - (stringWithoutID.IndexOf("last_name") + 14));
        var school = stringWithoutID.Substring(stringWithoutID.IndexOf("school") + 11, stringWithoutID.IndexOf("}")-2 - (stringWithoutID.IndexOf("school") + 11));

        student.id = id;
        student.username = username;
        student.password = password;
        student.email = email;
        student.fname = fname;
        student.lname = lname;
        student.school = school;


        return student;
    }
    private Teacher T_Deserialize(string rawJson)
    {
        var teacher = new Teacher();

        var id = rawJson.Substring(rawJson.IndexOf("ObjectId") + 10, 24);
        var stringWithoutID = rawJson.Substring(rawJson.IndexOf("),") + 4);
        var username = stringWithoutID.Substring(stringWithoutID.IndexOf("username") + 13, stringWithoutID.IndexOf("password") - 4 - (stringWithoutID.IndexOf("username") + 13));
        var password = stringWithoutID.Substring(stringWithoutID.IndexOf("password") + 13, stringWithoutID.IndexOf("email") - 4 - (stringWithoutID.IndexOf("password") + 13));
        var email = stringWithoutID.Substring(stringWithoutID.IndexOf("email") + 10, stringWithoutID.IndexOf("first_name") - 4 - (stringWithoutID.IndexOf("email") + 10));
        var fname = stringWithoutID.Substring(stringWithoutID.IndexOf("first_name") + 15, stringWithoutID.IndexOf("last_name") - 4 - (stringWithoutID.IndexOf("first_name") + 15));
        var lname = stringWithoutID.Substring(stringWithoutID.IndexOf("last_name") + 14, stringWithoutID.IndexOf("school") - 4 - (stringWithoutID.IndexOf("last_name") + 14));
        var school = stringWithoutID.Substring(stringWithoutID.IndexOf("school") + 11, stringWithoutID.IndexOf("}") - 2 - (stringWithoutID.IndexOf("school") + 11));

        teacher.id = id;
        teacher.username = username;
        teacher.password = password;
        teacher.email = email;
        teacher.fname = fname;
        teacher.lname = lname;
        teacher.school = school;


        return teacher;
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
    public string id { get; set; }
    public float exp { get; set; }

}
public class Teacher
{
    public string fname { get; set; }
    public string lname { get; set; }
    public string username { get; set; }
    public string password { get; set; }
    public string email { get; set; }
    public string school { get; set; }
    public string id { get; set; }
    public List<String> courses { get; set; }

}