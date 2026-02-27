using UnityEngine;
using UnityEngine.UI;

public class HUDController : MonoBehaviour
{
    public Text moneyText;
    public Slider healthSlider;
    public Text wantedText;

    void Update()
    {
        if (GameManager.Instance == null) return;

        moneyText.text = "$ " + GameManager.Instance.money;
        healthSlider.value = GameManager.Instance.health;

        int wanted = 0;
        if (WantedSystem.Instance != null)
            wanted = WantedSystem.Instance.wantedLevel;

        wantedText.text = "Wanted: " + wanted;
    }
}
