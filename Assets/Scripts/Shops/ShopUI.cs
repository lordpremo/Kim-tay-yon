using UnityEngine;
using UnityEngine.UI;

public class ShopUI : MonoBehaviour
{
    public Shop shop;
    public GameObject shopPanel;
    public Transform content;
    public GameObject itemButtonPrefab;

    void Start()
    {
        shopPanel.SetActive(false);
        PopulateShop();
    }

    void PopulateShop()
    {
        foreach (Transform child in content)
            Destroy(child.gameObject);

        for (int i = 0; i < shop.items.Length; i++)
        {
            int index = i;
            ShopItem item = shop.items[i];

            GameObject btn = Instantiate(itemButtonPrefab, content);
            btn.transform.Find("Name").GetComponent<Text>().text = item.itemName;
            btn.transform.Find("Price").GetComponent<Text>().text = "$" + item.price;

            if (item.icon != null)
                btn.transform.Find("Icon").GetComponent<Image>().sprite = item.icon;

            btn.GetComponent<Button>().onClick.AddListener(() =>
            {
                shop.BuyItem(index);
            });
        }
    }

    public void OpenShop()
    {
        shopPanel.SetActive(true);
        Time.timeScale = 0f;
    }

    public void CloseShop()
    {
        shopPanel.SetActive(false);
        Time.timeScale = 1f;
    }
}
