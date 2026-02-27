using UnityEngine;

public class WeatherManager : MonoBehaviour
{
    public ParticleSystem rain;
    public Light directionalLight;

    public float changeInterval = 60f;
    private float timer = 0f;

    private bool raining = false;

    void Update()
    {
        timer += Time.deltaTime;
        if (timer >= changeInterval)
        {
            timer = 0f;
            ToggleWeather();
        }
    }

    void ToggleWeather()
    {
        raining = !raining;

        if (rain != null)
        {
            if (raining) rain.Play();
            else rain.Stop();
        }

        if (directionalLight != null)
        {
            directionalLight.color = raining ? new Color(0.7f, 0.7f, 0.8f) : Color.white;
        }
    }
}
