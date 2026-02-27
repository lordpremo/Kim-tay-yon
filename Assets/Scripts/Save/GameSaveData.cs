using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class InventoryItemData
{
    public string itemName;
    public int amount;
}

[Serializable]
public class GameSaveData
{
    public float playerPosX;
    public float playerPosY;
    public float playerPosZ;

    public int money;
    public int health;
    public int wantedLevel;

    public List<InventoryItemData> inventoryItems = new List<InventoryItemData>();
}
