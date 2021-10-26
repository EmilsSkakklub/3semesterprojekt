using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UpdateCharInfo : MonoBehaviour
{

    public User user;
    public Text usernameText;
    public Text levelText;
    public Text expText;
    // Start is called before the first frame update
    void Start()
    {
        user = GameObject.Find("User").GetComponent<User>();
        usernameText = GameObject.Find("UsernameText").GetComponent<Text>();
        levelText = GameObject.Find("LevelText").GetComponent<Text>();
        expText = GameObject.Find("ExpText").GetComponent<Text>();


        usernameText.text = user._username.ToUpper();

        int level = 0;
        int exp = user._exp;
        while(exp >= 100)
        {
            level++;
            exp -= 100;
        }

        levelText.text = "Level " + level.ToString();
        expText.text = "EXP " + exp.ToString() + "/100";
    }
}
