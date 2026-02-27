using UnityEngine;

public class Shop : MonoBehaviour
{
    public ShopItem[] items;

    public void BuyItem(int index)
    {
        if (index < 0 || index >= items.Length) return;

        ShopItem item = items[index];

        if (GameManager.Instance.money < item.price)
        {
            Debug.Log("Not enough money!");
            return;
        }

        GameManager.Instance.money -= item.price;

        switch (item.type)
        {
            case ShopItem.ItemType.Health:
                GameManager.Instance.health = Mathf.Clamp(
                    GameManager.Instance.health + item.amount,
                    0,
                    100
                );
                break;

            case ShopItem.ItemType.Ammo:
                PlayerShooting shooter = FindObjectOfType<PlayerShooting>();
                if (shooter != null)
                {
                    shooter.AddAmmo(item.amount);
                }
                break;

            case ShopItem.ItemType.Weapon:
                PlayerShooting ps = FindObjectOfType<PlayerShooting>();
                if (ps != null)
                {
                    ps.EquipWeapon(item.weaponPrefab);
                }
                break;
        }
    }
}
