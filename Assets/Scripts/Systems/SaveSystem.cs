using UnityEngine;

public static class SaveSystem
{
    public static void Save()
    {
        if (GameManager.Instance == null) return;
        PlayerPrefs.SetInt("money", GameManager.Instance.money);
        PlayerPrefs.SetInt("health", GameManager.Instance.health);
        PlayerPrefs.Save();
    }

    public static void Load()
    {
        if (GameManager.Instance == null) return;
        if (!PlayerPrefs.HasKey("money")) return;

        GameManager.Instance.money = PlayerPrefs.GetInt("money", 0);
        GameManager.Instance.health = PlayerPrefs.GetInt("health", 100);
    }
}
