using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class UpdateHighscores : MonoBehaviour
{
    List<Student> StudentList = new List<Student>();
    User user;


    int amountOfUsers;
    private string URI = "http://localhost:3000/";

    Text HighscoreBox;
    Text Username;
    Text YourRank;

    // Start is called before the first frame update
    void Start()
    {
        user = GameObject.Find("User").GetComponent<User>();
        YourRank = GameObject.Find("PersonalScoreBG").GetComponentInChildren<Text>();
        Username = GameObject.Find("PersonalScoreText").GetComponentInChildren<Text>();

        StartCoroutine("UpdateHighscore");

    }

    // Update is called once per frame
    void Update()
    {
    }

    private IEnumerator UpdateHighscore()
    {
        WWWForm form = new WWWForm();

        using (UnityWebRequest www = UnityWebRequest.Post(URI + "gethighscores", form))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log(www.error);
            }
            else
            {
                var response = www.downloadHandler.text;
                if (response == "Info not found")
                {

                }
                else
                {
                    MakeHighscoreLists(response);
                }
            }
        }
    }
    public void MakeHighscoreLists(string json)
    {
        amountOfUsers = GetCount(json);
        List<string> HighscoreList = new List<string>();

        for (int i = amountOfUsers; i > 0; i--)
        {
            HighscoreList.Add(CutJson(json, ",", i));

        }

        for (int i = 0; i < amountOfUsers; i++)
        {
            int exp = CutExp(HighscoreList[i]);
            string username = CutUsername(HighscoreList[i]);

            StudentList.Add(new Student(exp, username));

        }

        StudentList.Sort();
        StudentList.Reverse();

        UpdateHighscoreText();
    }
    public void UpdateHighscoreText()
    {
        for (int i = 0; i <= 23; i++)
        {
            HighscoreBox = GameObject.Find("Highscore (" + i + ")").GetComponentInChildren<Text>();

            if (i < amountOfUsers)
            {
                int level = 0;
                int exp = StudentList[i].exp;
                while (exp >= 100)
                {
                    level++;
                    exp -= 100;
                }
                HighscoreBox.text = StudentList[i].username + "\nLevel " + level;

                if (StudentList[i].username == user._username)
                {
                    user._personalRank = i + 1;
                }
            }
            else
            {
                HighscoreBox.text = "-\n-";
            }


        }
        UpdatePersonalRank();
    }
    public void UpdatePersonalRank()
    {
        YourRank.text = "Your Rank: " + user._personalRank;
        Username.text = user._username;
    }
    public string CutJson(string json, string comma, int i)
    {

        int index = 0;
        int counter = 0;
        //find all indexes/occurrences of specified substring in string
        while ((index = json.IndexOf(comma, index)) != -1)
        {
            index++;
            counter++;
            if (counter == i)
            {
                break;
            }
        }
        string uncut = json.Substring(index);
        string cut = uncut.Remove(uncut.IndexOf(","));
        return cut;
    }
    public int CutExp(string userString)
    {
        int level = int.Parse(userString.Substring(userString.IndexOf(":") + 2, userString.LastIndexOf("\"") - (userString.IndexOf(":") + 2)));
        //Debug.Log(level);
        return level;
    }
    public string CutUsername(string userString)
    {
        string username = userString.Substring(1, userString.IndexOf(":") - 2);
        //Debug.Log(username);
        return username;
    }
    public int GetCount(string json)

    {
        int count = new int();
        count = int.Parse(json.Substring(10, json.IndexOf(",") - 1 - 10));

        return count;
    }
}

class Student : IComparable<Student>
{
    public int exp { get; set; }
    public string username { get; set; }

    public Student(int exp, string username)
    {
        this.exp = exp;
        this.username = username;
    }

    public int CompareTo(Student other)
    {
        if (other == null)
        {
            return 1;
        }

        return Comparer<int>.Default.Compare(this.exp, other.exp);
    }
}

