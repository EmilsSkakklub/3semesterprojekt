using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class UpdateHighscores : MonoBehaviour
{
    int users;
    List<string> highscoreList;
    SortedList<int, string> sortedHighscoreList = new SortedList<int, string>();

    private string URI = "http://localhost:3000/";

    // Start is called before the first frame update
    void Start()
    {
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
                    users = GetCount(response);
                    highscoreList = MakeHighscoreList(response);
                    Debug.Log(response);
                    /*foreach(var user in highscoreList)
                    {
                        int level = CutLevel(user);
                        string username = CutUsername(user);
                        sortedHighscoreList.Add(level, username);
                    }*/
                    for(int i = 0; i < highscoreList.Count; i++)
                    {
                        int level = CutLevel(highscoreList[i]);
                        string username = CutUsername(highscoreList[i]);
                        sortedHighscoreList.Add(level, username);
                    }
                    Debug.Log(sortedHighscoreList);
                }
            }
        }
    }

    public List<string> MakeHighscoreList(string json)
    {

        List<string> HighscoreList = new List<string>();
        for(int i = users; i>0 ; i--)
        {
                HighscoreList.Add(CutJson(json, ",", i));    
        }
    
        return HighscoreList;

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
    public int CutLevel(string userString)
    {
        int level = int.Parse(userString.Substring(userString.IndexOf(":") + 2, userString.LastIndexOf("\"") - (userString.IndexOf(":") + 2)));
        Debug.Log(level);
        return level;
    }
    public string CutUsername(string userString)
    {
        string username = userString.Substring(1,userString.IndexOf(":")-2);
        Debug.Log(username);
        return username;
    }
    public int GetCount(string json)
    
    {
        int count = new int();
        count = int.Parse(json.Substring(10, json.IndexOf(",") - 1 - 10));

        return count;
    }
}

