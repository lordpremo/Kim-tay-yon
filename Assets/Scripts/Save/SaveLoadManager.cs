using UnityEngine;

public class SaveLoadManager : MonoBehaviour
{
    public static SaveLoadManager Instance;

    public Transform player;

    const string SAVE_KEY = "GAME_SAVE_DATA";

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else Destroy(gameObject);
    }

    public void SaveGame()
    {
        if (player == null || GameManager.Instance == null) return;

        GameSaveData data = new GameSaveData();

        // Player position
        data.playerPosX = player.position.x;
        data.playerPosY = player.position.y;
        data.playerPosZ = player.position.z;

        // Stats
        data.money = GameManager.Instance.money;
        data.health = GameManager.Instance.health;

        if (WantedSystem.Instance != null)
            data.wantedLevel = WantedSystem.Instance.wantedLevel;

        // Inventory
        data.inventoryItems.Clear();
        foreach (var item in InventorySystem.Instance.items)
        {
            InventoryItemData i = new InventoryItemData
            {
                itemName = item.itemName,
                amount = item.amount
            };
            data.inventoryItems.Add(i);
        }

        string json = JsonUtility.ToJson(data);
        PlayerPrefs.SetString(SAVE_KEY, json);
        PlayerPrefs.Save();

        Debug.Log("Game Saved");
    }

    public void LoadGame()
    {
        if (!PlayerPrefs.HasKey(SAVE_KEY)) return;
        if (player == null || GameManager.Instance == null) return;

        string json = PlayerPrefs.GetString(SAVE_KEY);
        GameSaveData data = JsonUtility.FromJson<GameSaveData>(json);

        // Player position
        player.position = new Vector3(
            data.playerPosX,
            data.playerPosY,
            data.playerPosZ
        );

        // Stats
        GameManager.Instance.money = data.money;
        GameManager.Instance.health = data.health;

        if (WantedSystem.Instance != null)
            WantedSystem.Instance.wantedLevel = data.wantedLevel;

        // Inventory
        InventorySystem.Instance.items.Clear();
        foreach (var itemData in data.inventoryItems)
        {
            InventoryItem inv = new InventoryItem
            {
                itemName = itemData.itemName,
                amount = itemData.amount
            };
            InventorySystem.Instance.items.Add(inv);
        }

        Debug.Log("Game Loaded");
    }
}
