using UnityEngine;
using UnityEngine.UI;

public class InventoryUI : MonoBehaviour
{
    public GameObject panel;
    public Transform content;
    public GameObject itemSlotPrefab;

    void Start()
    {
        panel.SetActive(false);
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.I))
        {
            ToggleInventory();
        }
    }

    void ToggleInventory()
    {
        bool active = !panel.activeSelf;
        panel.SetActive(active);

        if (active)
        {
            RefreshUI();
            Time.timeScale = 0f;
        }
        else
        {
            Time.timeScale = 1f;
        }
    }

    void RefreshUI()
    {
        foreach (Transform child in content)
            Destroy(child.gameObject);

        foreach (var item in InventorySystem.Instance.items)
        {
            GameObject slot = Instantiate(itemSlotPrefab, content);
            slot.transform.Find("Name").GetComponent<Text>().text = item.itemName;
            slot.transform.Find("Amount").GetComponent<Text>().text = "x" + item.amount;

            if (item.icon != null)
                slot.transform.Find("Icon").GetComponent<Image>().sprite = item.icon;
        }
    }
}
