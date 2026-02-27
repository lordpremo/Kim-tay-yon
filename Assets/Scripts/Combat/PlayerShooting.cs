using UnityEngine;

public class PlayerShooting : MonoBehaviour
{
    public Weapon currentWeapon;
    public Transform weaponHolder;

    void Update()
    {
        // Hapa baadaye tutaongeza kubadilisha silaha
        if (currentWeapon == null) return;

        // Weapon yenyewe inashoot ndani ya Weapon.Update()
        // Hii script ni kwa ajili ya ku-manage weapons baadaye
    }

    public void EquipWeapon(Weapon newWeapon)
    {
        if (currentWeapon != null)
        {
            Destroy(currentWeapon.gameObject);
        }

        currentWeapon = Instantiate(newWeapon, weaponHolder.position, weaponHolder.rotation, weaponHolder.transform);
    }
}
