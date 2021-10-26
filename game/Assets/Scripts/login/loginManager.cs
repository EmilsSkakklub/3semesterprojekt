using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class loginManager : MonoBehaviour
{
    public static string username;

    private InputField username_input;
    private InputField password_input;
    private GameObject errormsg;
    private User user;
    private string URI = "http://localhost:3000/";
    // Start is called before the first frame update
    void Start()
    {
        username_input = GameObject.Find("username_input").GetComponent<InputField>();
        password_input = GameObject.Find("password_input").GetComponent<InputField>();
        errormsg = GameObject.Find("login_error_text");
        user = GameObject.Find("User").GetComponent<User>();

        errormsg.SetActive(false);
    }
    public void TryLogin() {
        StartCoroutine("LoginPOST");
    }

    public IEnumerator LoginPOST()
    {
        //POST request
        Debug.Log("Button CLicked");
        Debug.Log(username_input.text);
        Debug.Log(password_input.text);
        Debug.Log(URI + "login");

        WWWForm form = new WWWForm();
        form.AddField("username", username_input.text);
        form.AddField("password", password_input.text);

        using (UnityWebRequest www = UnityWebRequest.Post(URI+"login", form))
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

                if (www.downloadHandler.text == "Player logged in")
                {
                    user.GetUsername(username_input.text);
                    SceneManager.LoadScene("HomeScene");
                } 
                else if (www.downloadHandler.text == "Player not found")
                {
                    username_input.text = "";
                    password_input.text = "";
                    errormsg.SetActive(true);
                }


            }
        }
    }
}
