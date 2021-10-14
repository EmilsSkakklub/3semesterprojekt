using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{

    public void LoadGame() {
        SceneManager.LoadScene("GameScene");
    }

    public void LoadHighscore() {
        SceneManager.LoadScene("HighscoreScene");
    }

    public void LoadInfo() {
        SceneManager.LoadScene("InfoScene");
    }

    public void QuitApplication() {
        Application.Quit();
    }

}
