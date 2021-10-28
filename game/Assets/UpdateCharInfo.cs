using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class UpdateCharInfo : MonoBehaviour
{

    public User user;
    public Text usernameText;
    public Text levelText;
    public Text expText;

    string URI = "http://localhost:3000/";

    // Start is called before the first frame update
    void Start()
    {
        user = GameObject.Find("User").GetComponent<User>();
        usernameText = GameObject.Find("UsernameText").GetComponent<Text>();
        levelText = GameObject.Find("LevelText").GetComponent<Text>();
        expText = GameObject.Find("ExpText").GetComponent<Text>();
        
        StartCoroutine("GetExp");

        usernameText.text = user._username.ToUpper();
    }
    private void Update()
    {
        int level = 0;
        int exp = user._exp;
        while (exp >= 100)
        {
            level++;
            exp -= 100;
        }

        levelText.text = "Level " + level.ToString();
        expText.text = "EXP " + exp.ToString() + "/100";
    }
    public IEnumerator GetExp()
    {
        WWWForm form = new WWWForm();
        form.AddField("username", user._username);

        using (UnityWebRequest www = UnityWebRequest.Post(URI + "getexp", form))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log(www.error);
            }
            else
            {
                Debug.Log("Form upload complete!");
                
                var response = www.downloadHandler.text;
                Debug.Log(response);

                if (response == "Info not found")
                {

                }
                else
                {
                    user._exp = Int32.Parse(response);
                }


            }
        }
    }
}
