using UnityEngine;
using System.Collections.Generic;

public class MissionManager : MonoBehaviour
{
    public static MissionManager Instance;

    public List<Mission> missions = new List<Mission>();
    public UnityEngine.UI.Text missionText;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    void Start()
    {
        UpdateMissionUI();
    }

    public void CompleteMission(string id)
    {
        var m = missions.Find(x => x.id == id);
        if (m != null && !m.isCompleted)
        {
            m.isCompleted = true;
            UpdateMissionUI();
        }
    }

    void UpdateMissionUI()
    {
        if (missionText == null) return;
        string txt = "";
        foreach (var m in missions)
        {
            txt += (m.isCompleted ? "[✓] " : "[ ] ") + m.title + "\n";
        }
        missionText.text = txt;
    }
}
