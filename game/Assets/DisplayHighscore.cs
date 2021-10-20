using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class DisplayHighscore : MonoBehaviour
{

    private DatabaseAccess databaseAccess;
    // Start is called before the first frame update
    void Start()
    {
        databaseAccess = GameObject.FindGameObjectWithTag("DatabaseAccess").GetComponent<DatabaseAccess>();
        Invoke("DisplayHighScoreInTextMesh", 0f);
    }

    private async void DisplayHighScoreInTextMesh()
    {
        var task = databaseAccess.GetStudentsFromDataBase();
        var result = await task;
        var output = "";
        foreach (var student in result)
        {
            output += "Username: " + student.username + "\n" + "Name: " + student.fname + " " + student.lname + "\n" + "Password: " + student.password + "\n" + "School: " + student.school + "\n" + "Email: " + student.email + "\n ------------------------------------------\n";
        }
        Debug.Log(output);
    }

    
}
