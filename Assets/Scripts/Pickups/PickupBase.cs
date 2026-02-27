using UnityEngine;

public abstract class PickupBase : MonoBehaviour
{
    public float rotateSpeed = 60f;

    void Update()
    {
        transform.Rotate(Vector3.up * rotateSpeed * Time.deltaTime);
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            OnPickup(other.gameObject);
            Destroy(gameObject);
        }
    }

    protected abstract void OnPickup(GameObject player);
}
