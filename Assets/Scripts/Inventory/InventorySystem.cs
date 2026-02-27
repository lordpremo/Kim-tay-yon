using System.Collections.Generic;
using UnityEngine;

public class InventorySystem : MonoBehaviour
{
    public static InventorySystem Instance;

    public List<InventoryItem> items = new List<InventoryItem>();

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    public void AddItem(InventoryItem newItem)
    {
        InventoryItem existing = items.Find(i => i.itemName == newItem.itemName);

        if (existing != null)
        {
            existing.amount += newItem.amount;
        }
        else
        {
            items.Add(newItem);
        }
    }

    public void RemoveItem(string itemName, int amount = 1)
    {
        InventoryItem existing = items.Find(i => i.itemName == itemName);
        if (existing == null) return;

        existing.amount -= amount;
        if (existing.amount <= 0)
            items.Remove(existing);
    }

    public InventoryItem GetItem(string itemName)
    {
        return items.Find(i => i.itemName == itemName);
    }
}
