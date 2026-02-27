using UnityEngine;
using UnityEngine.UI;

public class ZoneHUD : MonoBehaviour
{
    public Text zoneText;

    void Update()
    {
        if (WorldManager.Instance == null) return;
        zoneText.text = WorldManager.Instance.currentZoneName;
    }
}
