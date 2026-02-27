using UnityEngine;

public class DayNightCycle : MonoBehaviour
{
    public Light directionalLight;
    public float dayLengthInMinutes = 10f;
    [Range(0f, 1f)] public float timeOfDay = 0.25f; // 0 = midnight, 0.25 = 6am, 0.5 = noon, 0.75 = 6pm

    void Update()
    {
        if (directionalLight == null) return;

        float daySeconds = dayLengthInMinutes * 60f;
        timeOfDay += Time.deltaTime / daySeconds;
        if (timeOfDay > 1f) timeOfDay -= 1f;

        float angle = timeOfDay * 360f - 90f;
        directionalLight.transform.rotation = Quaternion.Euler(angle, 170f, 0f);

        float intensity = Mathf.Clamp01(Mathf.Cos(timeOfDay * Mathf.PI * 2f) * 0.5f + 0.5f);
        directionalLight.intensity = Mathf.Lerp(0.1f, 1.2f, intensity);
    }
}
