using UnityEngine;

public class SaveHotkeys : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.F5))
        {
            SaveLoadManager.Instance.SaveGame();
        }

        if (Input.GetKeyDown(KeyCode.F9))
        {
            SaveLoadManager.Instance.LoadGame();
        }
    }
}
