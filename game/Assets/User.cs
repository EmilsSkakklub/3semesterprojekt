using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class User : MonoBehaviour
{
    private string URI = "http://localhost:3000/";

    public string _username;
    public string _fname;
    public string _lname;
    public string _email;
    public string _school;

    // Start is called before the first frame update
    void Awake()
    {
        GameObject[] objs = GameObject.FindGameObjectsWithTag("User");

        if (objs.Length > 1)
        {
            Destroy(this.gameObject);
        }

        DontDestroyOnLoad(this.gameObject);
    }

    public void GetUsername(string LoggedUser)
    {
        _username = LoggedUser;
        StartCoroutine("GetUserInfo");
    }
    public IEnumerator GetUserInfo()
    {
        WWWForm form = new WWWForm();
        form.AddField("username", _username);

        using (UnityWebRequest www = UnityWebRequest.Post(URI + "getuserinfo", form))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log(www.error);
            }
            else
            {
                Debug.Log("Form upload complete!");
                Debug.Log(www.downloadHandler.text);

                if (www.downloadHandler.text == "Info not found")
                {
                    
                }
                else
                {
                    DeserializeJson(www.downloadHandler.text);
                }


            }
        }
    }
    public void DeserializeJson(string rawjson)
    {
        //"{\"email\":\"raplo20@student.sdu.dk\",\"fname\":\"Rasmus\",\"lname\":\"Ploug\", \"school\":\"SDU - Odense\"}"
        _email = rawjson.Substring(10, rawjson.IndexOf("fname") - 3 - 10);
        _fname = rawjson.Substring(rawjson.IndexOf("fname") + 8, rawjson.IndexOf("lname") - 3 - (rawjson.IndexOf("fname") + 8));
        _lname = rawjson.Substring(rawjson.IndexOf("lname") + 8, rawjson.IndexOf("school") - 4 - (rawjson.IndexOf("lname") + 8));
        _school = rawjson.Substring(rawjson.IndexOf("school") + 9, rawjson.IndexOf("}") - 1 - (rawjson.IndexOf("school") + 9));
    }
}
