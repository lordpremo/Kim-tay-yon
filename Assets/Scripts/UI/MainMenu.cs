using UnityEngine;

public class MainMenu : MonoBehaviour
{
    public void PlayGame()
    {
        SceneLoader.LoadScene("Game");
    }

    public void QuitGame()
    {
        Application.Quit();
    }
}
