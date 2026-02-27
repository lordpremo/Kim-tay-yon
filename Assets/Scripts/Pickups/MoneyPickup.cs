using UnityEngine;

public class MoneyPickup : PickupBase
{
    public int amount = 50;

    protected override void OnPickup(GameObject player)
    {
        GameManager.Instance.AddMoney(amount);
    }
}
