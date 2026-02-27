using UnityEngine;

public class WorldManager : MonoBehaviour
{
    public static WorldManager Instance;

    public string currentZoneName = "Unknown";
    public int currentTrafficLevel = 1;
    public int currentPoliceLevel = 1;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    public void SetCurrentZone(CityZone zone)
    {
        currentZoneName = zone.zoneName;
        currentTrafficLevel = zone.trafficLevel;
        currentPoliceLevel = zone.policeLevel;

        Debug.Log("Entered zone: " + currentZoneName);
    }
}
