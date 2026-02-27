using UnityEngine;

[System.Serializable]
public class InventoryItem
{
    public string itemName;
    public Sprite icon;
    public int amount;
    public enum ItemType { Weapon, Ammo, Health, KeyItem }
    public ItemType type;

    public Weapon weaponPrefab;
}
