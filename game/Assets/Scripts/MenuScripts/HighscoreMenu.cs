using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class HighscoreMenu : MonoBehaviour
{
    public void LoadProfileScene() {
        SceneManager.LoadScene("ProfileScene");
    }
}
