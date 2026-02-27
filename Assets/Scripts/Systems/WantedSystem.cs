using UnityEngine;

public class WantedSystem : MonoBehaviour
{
    public static WantedSystem Instance;

    public int wantedLevel = 0;
    public int maxWanted = 5;
    public float decayTime = 10f;

    private float timer = 0f;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    void Update()
    {
        if (wantedLevel > 0)
        {
            timer += Time.deltaTime;
            if (timer >= decayTime)
            {
                wantedLevel--;
                timer = 0f;
            }
        }
    }

    public void AddWanted(int amount)
    {
        wantedLevel = Mathf.Clamp(wantedLevel + amount, 0, maxWanted);
        timer = 0f;
    }
}
