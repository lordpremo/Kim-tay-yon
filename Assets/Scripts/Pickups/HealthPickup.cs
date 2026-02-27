using UnityEngine;

public class HealthPickup : PickupBase
{
    public int healAmount = 25;

    protected override void OnPickup(GameObject player)
    {
        GameManager.Instance.health = Mathf.Clamp(
            GameManager.Instance.health + healAmount,
            0,
            100
        );
    }
}
