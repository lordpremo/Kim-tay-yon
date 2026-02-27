using UnityEngine;

[System.Serializable]
public class ShopItem
{
    public string itemName;
    public int price;
    public Sprite icon;
    public enum ItemType { Weapon, Health, Ammo }
    public ItemType type;

    public Weapon weaponPrefab;
    public int amount;
}
