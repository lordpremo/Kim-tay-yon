using UnityEngine;

public class CityZone : MonoBehaviour
{
    public string zoneName = "Downtown";
    public int trafficLevel = 3;
    public int policeLevel = 2;

    void OnTriggerEnter(Collider other)
    {
        if (!other.CompareTag("Player")) return;

        WorldManager.Instance.SetCurrentZone(this);
    }

    void OnDrawGizmos()
    {
        Gizmos.color = new Color(0f, 0.5f, 1f, 0.2f);
        var col = GetComponent<Collider>();
        if (col != null)
            Gizmos.DrawCube(col.bounds.center, col.bounds.size);
    }
}
